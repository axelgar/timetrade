'use strict';
const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const users = [{
  username: 'Caroline',
  password: bcrypt.hashSync('caroline', salt),
  coins: 140,
  url: '../images/Caroline.jpg',
  contact: 34660138922
}, {
  username: 'Axel',
  password: bcrypt.hashSync('axel', salt),
  coins: 60,
  url: '../images/Axel.jpeg',
  contact: 34660138922
}, {
  username: 'Gabriela',
  password: bcrypt.hashSync('gabriela', salt),
  coins: 100,
  url: '../images/Gabriela.JPG',
  contact: 34660138922
}, {
  username: 'Guille',
  password: bcrypt.hashSync('guille', salt),
  coins: 30,
  url: '../images/Guille.JPG',
  contact: 34660138922
}];

module.exports = users;
