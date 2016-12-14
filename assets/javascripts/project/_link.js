// link

var _link = {
  back: function(link) {
    if(link.length) {
      link.click(function(e) {
        e.preventDefault();
        window.history.back(-1);
      });
    }
  },

  current: function(modifier) {
    var path = window.location.pathname.split('/');
    var url = '';

    for (var i = 1; i < path.length; i++) {
      url += '/' + path[i];

      $('a[href="'+ url +'"]').addClass(modifier);
    }
  },

  prevent: function(link) {
    if(link.length) {
      link.click(function(e) {
        e.preventDefault();
      });
    }
  },

  scrollTo: function(links) {
    if(links.length) {
      links.on('click', function(e) {
        e.preventDefault();

        links.removeClass('link--current');
        $(this).addClass('link--current');

        $('html, body').stop().animate({
          scrollTop: $($(this).attr('href')).offset().top
        }, 300, 'easeOutQuad');
      })
    }
  }
}
