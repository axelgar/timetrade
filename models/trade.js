'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const tradeSchema = new Schema({
  service: {
    type: ObjectId,
    ref: 'Service'
  },
  consumer: {
    type: ObjectId,
    ref: 'User'
  },
  owner: {
    type: ObjectId,
    ref: 'User'
  },
  state: {
    type: String,
    enum: ['booked', 'accepted', 'confirmed', 'rejected', 'cancelled'],
    default: 'booked'
  }
});

const Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;
