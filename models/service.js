'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const serviceSchema = new Schema({
  owner: {
    type: ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  time: {
    type: String,
    enum: ['15', '30', '45', '60']
  },
  category: {
    type: String,
    enum: ['languages', 'technology', 'arts', 'social', 'sports']
  }
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
