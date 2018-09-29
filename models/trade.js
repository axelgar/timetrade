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
  providerState: {
    type: String,
    enum: ['booked', 'accepted', 'confirmed', 'rejected', 'cancelled'],
    default: 'booked'
  },
  consumerState: {
    type: String,
    enum: ['booked', 'accepted', 'confirmed', 'rejected', 'cancelled'],
    default: 'booked'
  }
});


tradeSchema.virtual('isAccepted').get(function () {
  return this.consumerState === 'accepted' || this.providerState === 'accepted';
});

tradeSchema.virtual('isRejected').get(function () {
  return this.consumerState === 'rejected';
});

tradeSchema.virtual('isConfirmed').get(function () {
  return this.consumerState === 'confirmed' && this.providerState === 'confirmed';
});

const Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;
