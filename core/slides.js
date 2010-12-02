var sIndex = 0,
    slide;
$(function() {
   var i = 0, steps, s;
   while (++i) {
       steps = $('.step'+i);
       if (steps.length) steps.css('opacity','0.001'); else break;
   }

   $('.theme').click(function() {
       var that = this;
       $(this)
           .parent()
           .find('.selected')
               .removeClass('selected')
           .end()
           .addClass('selected');
       $('link')
           .eq(1)
           .attr('href', that.id + "/main.css");
   });

   $('#slides>div').each(function(index) {
     $(this)
         .append($('<div>')
         .addClass('counter')
         .text(index+1))  
   });
   slide = $('#slides>div:first');
   $(window)
       .mousewheel(function(i,delta) {
           delta > 0 ? next() : back();
       })
       .keydown(function(e) {
            if (/^(input|textarea)$/i.test(e.target.nodeName)) return;
            switch (e.keyCode) {
              case 37: // left arrow
                back(); break;
              case 39: // right arrow
              case 32: // space
                next(); break;
            }
       })
   var first = $('#slides>div:first'),
       left = ($(window).width()/2) - (first.width()/2);
   first.css('margin-left', left);
   if (s!=window.location.hash.substr(1)) window.location.hash = "0";
   //handles back button   
   (function() {
      var s;
      if (s = window.location.hash.substr(1)) if (s!= sIndex) slideTo(s);
      //watch Paul Irish's 10 Things I learned From the jQuery Source video
      (function(a) {
          setTimeout(a, 500);
      })(arguments.callee);
   })();
});

function hideAfter(s) {
   var j,
       my_slide,
       i;
   for (i = s; i < $('#slides>div').length; i++) {
       my_slide = $('#slides>div:eq(' + i + ')');
       j = 0;
       while (++j) {
           steps = my_slide.find('.step'+j);
           if (steps.length) steps.css('opacity','0.001'); else break;
           my_slide.attr('step',j);
       }
   }
}

function showUpTo(s) {
   var j,
       my_slide,
       i;
   for (i = 1; i < s; i++) {
       console.log(i);
       my_slide = $('#slides>div:eq(' + i + ')');
       j = 0;
       while (++j) {
           steps = my_slide.find('.step'+j);
           if (steps.length) steps.css('opacity','1'); else break;
           my_slide.attr('step',j);
       }
   }
}

function next() {
    var nextStep = slide.attr('step') ? +slide.attr('step') + 1 : 1,
        f = slide.find('.step' + nextStep);
    if (f.length) {
        slide.find('step' + slide.attr('step')).stop(0,1);
        showEl(f);
        slide.attr('step',nextStep);
    } else {
        slideTo(sIndex+1);
    }
}

function showEl(el) {
    var show = function() { el.css('opacity','1'); },
        effex = {
        show: function() { el.css('opacity','1'); },
        blackify: function() {
            show();
            el.animate({
                color: 'black'   
            },500);
        },
        drop: function(dir) { 
            el.show('drop',{ direction: dir }, 500, function() { show(); });   
        },
        leftSlide: function() { this.drop('left'); },
        rightSlide: function() { this.drop('right'); },
        fold: function() {
            el.show('fold',{},500, function() { show(); });
        },
        fadeIn: function() { 
            el.fadeTo(500, '1', function() { show(); });   
        }
    },
       effected = false;
    el.attr('class').split(' ').forEach(function(a) {
      console.log(a);
      if (effex[a]) { effected=true; effex[a](); }
    });
    if (!effected) { effex.fadeIn(); } //fadeIn == default
}

function back() {
    var step = +slide.attr('step'),
        f = slide.find('.step' + step);
    if (f.length) {
        f.css('opacity','0.001');   
        slide.attr('step',step-1);
    } else {
        slideTo(sIndex-1);
    }
}

function supportsTransition() {
    var d = document.createElement('div');
    return d.style['-webkit-transition'] !== undefined || d.style['-moz-transition'] !== undefined || d.style['-o-transition'] !== undefined 
}


function slideTo(index) {
  if (index<0 || index>=$('#slides>div').length) return;
  if (Math.abs(sIndex-index)) { showUpTo(index); }
  window.location.hash = index;
  sIndex = index;
  slide = $('#slides>div').eq(index);
  var moveWidth = 975;
  if (supportsTransition()) {
      $('#slides').css({
        '-webkit-transform': 'translate(' + (-index*moveWidth) + 'px, 0px)',
        '-moz-transform': 'translate(' + (-index*moveWidth) + 'px, 0px)',
        '-o-transform': 'translate(' + (-index*moveWidth) + 'px, 0px)'
      });
  } else {
      $('#slides').stop().animate({
           marginLeft: -index*moveWidth  
      }, 100, 'swing');
  }
}
