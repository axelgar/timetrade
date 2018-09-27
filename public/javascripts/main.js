'use strics';
const body = document.getElementsByTagName('body')[0];

window.onscroll = function () {
  var currentScrollPos = window.pageYOffset;
  if (currentScrollPos > 35) {
    body.classList.add('scrolled');
    document.querySelector('.time').src = '/images/hourglass2.png';
  } else {
    body.classList.remove('scrolled');
    document.querySelector('.time').src = '/images/hourglass.png';
  }
};
