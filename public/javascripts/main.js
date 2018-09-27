'use strict';
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

const checkbox = document.querySelector('.menu-checkbox');

document.body.addEventListener('click', () => {
  if (checkbox.checked === false) {
    checkbox.checked = true;
  } else {
    checkbox.checked = false;
  }
  checkbox.addEventListener('click', event => event.stopPropagation(event));
});
