// application

$(function(){
  // link
  _link.back(
    $('.link--back')
  );

  _link.current(
    'link--current'
  );

  _link.prevent(
    $('.link--prevent')
  );

  _link.scrollTo(
    $('.nav__link')
  );

  // owl
  _owl.slide(
    $('.slide')
  );

  // nav
  _nav.open(
    $('html'),
    $('.nav'),
    $('.nav__link'),
    $('.nav__btn'),
    'nav--opened'
  );

  console.info('E aí developer, beleza? Pelo que você pode ver, não tem erros por aqui :)');
});
