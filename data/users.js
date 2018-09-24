'use strict';
const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const users = [{
  username: 'Caroline',
  password: bcrypt.hashSync('caroline', salt),
  coins: 140
}, {
  username: 'Axel',
  password: bcrypt.hashSync('axel', salt),
  coins: 60
}, {
  username: 'Gabriela',
  password: bcrypt.hashSync('gabriela', salt),
  coins: 100
}, {
  username: 'Guille',
  password: bcrypt.hashSync('guille', salt),
  coins: 30
}];

module.exports = users;
