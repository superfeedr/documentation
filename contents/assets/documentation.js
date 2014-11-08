$(document).ready(function(){
	var initialTop = $('.docs-inline-nav').position().top;
	$(document).on('scroll', function() {
		if($(document).scrollTop() > initialTop) {
			$('.docs-inline-nav').css({ top: '0' });
			$('.docs-inline-nav').addClass('docs-inline-nav-fixed');
		}
		else {
			$('.docs-inline-nav').removeClass('docs-inline-nav-fixed');
		}
  });
});
