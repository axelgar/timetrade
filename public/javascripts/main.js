'use strics';

var prevScrollpos = window.pageYOffset;
window.onscroll = function () {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos < currentScrollPos) {
    document.querySelector('#nav-bg').style.top = '-1px';
  } else {
    document.querySelector('#nav-bg').style.top = '-80px';
  }
  prevScrollpos = currentScrollPos;
}
;
