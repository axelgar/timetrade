'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  coins: {
    type: Number,
    default: 60
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
