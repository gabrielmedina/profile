const LABELS: Record<string, string> = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  tsx: 'TSX',
  jsx: 'JSX',
  css: 'CSS',
  scss: 'SCSS',
  html: 'HTML',
  json: 'JSON',
  md: 'Markdown',
  markdown: 'Markdown',
  bash: 'Bash',
  sh: 'Shell',
  shell: 'Shell',
  zsh: 'Shell',
  plaintext: 'Texto',
  text: 'Texto',
  txt: 'Texto',
}

export function codeLanguageLabel(language: string | undefined): string {
  if (!language) return 'Código'

  const key = language.trim().toLowerCase()
  return LABELS[key] ?? language.trim()
}
