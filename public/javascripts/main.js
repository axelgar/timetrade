'use strict';
const body = document.getElementsByTagName('body')[0];
const checkbox = document.querySelector('.menu-checkbox');
const main  = document.getElementById('site-main');
const time = document.querySelector('.time');

window.onscroll = function () {
  var currentScrollPos = window.pageYOffset;
  if (currentScrollPos > 35) {
    body.classList.add('scrolled');
  if (time) time.src = '/images/hourglass2.png';
  } else {
    body.classList.remove('scrolled');
    if (time) time.src = '/images/hourglass.png';
  }
};

main.addEventListener('click', () => {
  if (checkbox.checked === true) {
    checkbox.checked = false;
  }
});