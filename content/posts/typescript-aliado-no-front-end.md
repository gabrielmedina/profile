---
title: 'TypeScript no front-end. Aliado na hora de criar componentes e funcionalidades.'
description: 'Como tipar props, estados e fronteiras de dados para o editor e o compilador trabalharem a seu favor — com boas práticas e a opinião de quem usa isso no dia a dia.'
keys: 'Front-end, React, TypeScript'
image: /imgs/posts/typescript-aliado-no-front-end.jpg
slug: typescript-aliado-no-front-end
lang: pt-BR
date: '2026-10-28'
---

![Capa: cartões de vidro ligados por uma linha e, no cartão iluminado, a logo oficial do TypeScript.](/imgs/posts/typescript-aliado-no-front-end.webp)

No front-end, o bug caro quase nunca é “o botão não renderizou”. É a prop errada que só aparece depois do deploy. É o estado de loading misturado com sucesso. É a resposta da API que mudou de forma e a tela ainda confia no formato antigo.

TypeScript não elimina esse risco sozinho. Mas muda **quando** você encontra o problema: do runtime do usuário para o editor e o compilador. O [Handbook](https://www.typescriptlang.org/docs/handbook/2/basic-types.html) descreve isso de forma direta — um type-checker estático faz previsões sobre o código **antes** de ele rodar.

Na minha opinião, esse é o valor real no dia a dia: menos “funciona na minha máquina”, mais contrato explícito entre componente, feature e dado.

## O que o TypeScript realmente entrega

Antes de falar de props e hooks, vale ancorar no que a documentação oficial promete — e no que ela **não** promete.

Segundo [The Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html):

- **Checagem estática.** Typos, chamadas inválidas e propriedades inexistentes aparecem cedo.
- **Tooling.** Autocomplete, quick fixes, “go to definition” e refactoring vêm do mesmo type-checker — não são um plugin separado.
- **Tipos apagados em runtime.** Anotações não mudam o comportamento do JavaScript gerado. TypeScript não valida a API sozinho; ele valida o que você modelou.
- **Strictness como dial.** `"strict": true` liga o pacote de checagens. Em codebase nova, a própria doc recomenda ligar. Os dois flags que mais pesam no front são `noImplicitAny` e `strictNullChecks`.

Essa última frase importa. Tipar “um pouco” e deixar `any` espalhado é quase o mesmo que escrever JavaScript com ruído extra. O aliado só aparece quando o dial sobe.

## Props como contrato do componente

No React com TypeScript, o ponto de entrada é tipar as props. A doc de [JSX](https://www.typescriptlang.org/docs/handbook/jsx.html) trata Function Components como funções cujo primeiro argumento é o objeto de props — e o retorno precisa ser atribuível a `JSX.Element`. Arquivo `.tsx` e opção `jsx` ligadas; o resto é modelar o contrato.

Na prática, eu começo simples:

```tsx
interface ButtonProps {
  label: string
  disabled?: boolean
  onClick?: () => void
}

function Button({ label, disabled = false, onClick }: ButtonProps) {
  return (
    <button type="button" disabled={disabled} onClick={onClick}>
      {label}
    </button>
  )
}
```

Três hábitos que evitam dor:

1. **Nomear o tipo de props** (`ButtonProps`), não deixar um objeto inline crescer sem dono.
2. **Opcional de verdade.** `?` só quando a ausência é um caso válido — e default na desestruturação quando faz sentido.
3. **Evitar `React.FC` como default.** Tipar a função e as props basta; `children` entra no tipo quando o componente realmente precisa.

Quando o componente precisa de variantes mutuamente exclusivas, union discriminada vence um monte de booleans:

```tsx
type FeedbackProps =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; title: string }

function Feedback(props: FeedbackProps) {
  switch (props.status) {
    case 'idle':
      return null
    case 'loading':
      return <p>Carregando…</p>
    case 'error':
      return <p role="alert">{props.message}</p>
    case 'success':
      return <p>{props.title}</p>
  }
}
```

Aqui entra [narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html): depois do `case`, o TypeScript refina o tipo. `message` só existe em `error`. O editor para de sugerir propriedade que não faz sentido naquele ramo — e o review fica mais honesto sobre estados impossíveis.

## Tipar a feature, não só o JSX

Componente tipado com dado frouxo é fachada. A feature precisa de tipos nos mesmos lugares em que a regra de negócio mora.

### Estado de UI

`useState` infere bem a partir do valor inicial. Quando o estado começa vazio e depois vira objeto, eu anoto na borda:

```tsx
type SelectedPlan = { id: string; name: string }

const [plan, setPlan] = useState<SelectedPlan | null>(null)
```

Sem isso, o TypeScript aceita qualquer coisa no `setPlan` — e a tela vira um ímã de `as`.

### Eventos e handlers

Prefiro o tipo do evento do elemento certo (`React.ChangeEvent<HTMLInputElement>`, `React.MouseEvent<HTMLButtonElement>`) a `any` no handler. É chato uma vez. Depois vira autocomplete.

### Listas e genéricos leves

Para componentes reutilizáveis, genérico curto basta:

```tsx
type ListProps<T> = {
  items: T[]
  getKey: (item: T) => string
  renderItem: (item: T) => React.ReactNode
}

function List<T>({ items, getKey, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={getKey(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}
```

Não precisa de magia de conditional types no primeiro dia. Precisa de um `T` que impeça misturar “usuário” com “produto” no mesmo map.

### Utility types no lugar certo

A referência de [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html) cobre transformações do dia a dia. No front, eu uso com frequência:

- **`Pick` / `Omit`** — derivar props de um tipo de domínio sem duplicar campos.
- **`Partial`** — formulário de edição ou patch, com cuidado: parcial demais esconde o que é obrigatório no submit.
- **`Record`** — mapas de chave conhecida (`Record<Status, string>` para labels).
- **`Readonly`** — quando o valor não deveria ser mutado depois de montado.

O critério: utility type quando evita cópia e mentira. Não quando vira quebra-cabeça que só o autor lê.

## A fronteira importa mais que o miolo

Tipos são apagados. A doc é explícita: anotações **nunca** mudam o comportamento em runtime. Então a resposta da API, o `localStorage` e o query string continuam sendo JavaScript dinâmico até você validar.

No dia a dia, o padrão que mais me salva é:

1. **Validar na borda** (Zod, ou o validador do time).
2. **Inferir o tipo a partir do schema** (`z.infer<typeof schema>`).
3. **Passar dado já tipado** para a página e para os componentes.

Assim o TypeScript e a validação contam a mesma história. Tipar “na mão” um JSON remoto e torcer é só documentação otimista.

O mesmo vale para props que cruzam o limite do design system: contrato público pequeno, estável, tipado. Extensão additive. Breaking change com caminho de saída — o tipo é parte desse contrato, não um detalhe do arquivo `.tsx`.

## Boas práticas que eu carrego no review

Lista curta, sem dogma:

- **Ligue `strict`.** Sem `strictNullChecks`, `null` vira surpresa em produção. A [própria doc](https://www.typescriptlang.org/docs/handbook/2/basic-types.html#strictness) trata isso como dial que vale girar.
- **Anote nas bordas; deixe inferir no miolo.** Tipo em props, retorno de serviço, payload validado. Variável local óbvia não precisa de anotação.
- **Fuja de `any` e de `as` rotineiro.** Assertion é escape hatch, não estilo. Se você precisa de `as` o tempo todo, o modelo está errado.
- **Modele estados impossíveis fora do tipo.** Union discriminada > três booleans que combinam mal.
- **Não tipar “para impressionar”.** Conditional type de três andares que ninguém no time lê não é engenharia — é atrito.
- **Trate `unknown` no catch e no JSON parse.** Force o narrowing. É o narrowing do Handbook aplicado a dado sujo.
- **Alinhe tipagem com pasta e responsabilidade.** Tipo de domínio perto da feature; tipo de props perto do componente; schema na borda de I/O.

## Minha opinião de uso no dia a dia

Uso TypeScript menos como “linguagem diferente” e mais como **sistema de feedback**.

Quando abro um PR de front, as perguntas que o tipo me ajuda a responder são:

- Essa prop é obrigatória de verdade?
- Esse componente aceita um estado que a UI nunca deveria mostrar?
- Se eu renomear um campo no domínio, quantas telas quebram **agora**, no CI — não na segunda-feira?

No editor, o ganho aparece no autocomplete honesto e no refactor menos assustador. No time, aparece no code review: discutimos o contrato, não o chute.

O que eu **não** faço: transformar cada arquivo em tese de type-level programming. O Handbook inteiro existe para consulta — [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html), [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html), [Creating Types from Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html). Eu abro a página quando o problema pede. Não carrego genérico avançado por esporte.

Também não confundo TypeScript com teste. Tipo bom reduz classe de bug. Não prova que o botão está acessível, que a query está certa ou que o copy faz sentido. Aliado, não substituto.

**TypeScript no front-end vale quando vira hábito de modelar o domínio — não quando vira ornamento de sintaxe.**

## O principal aprendizado?

**TypeScript é aliado quando o tipo descreve o contrato da UI e a borda do dado. Fora disso, é só ruído compilado.**

Comece pelas props, pelos estados discriminados e pela validação na fronteira. Ligue o `strict`. Deixe o Handbook ([typescriptlang.org/docs](https://www.typescriptlang.org/docs/)) ser referência, não enfeite. O resto — genéricos, utilities, type manipulation — entra quando a feature pedir, não quando o ego pedir.
