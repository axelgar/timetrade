'use strict';

require('dotenv').config();

const mongoose = require('mongoose');
const data = require('../../data/services.js');

const Service = require('../../models/service.js');

const options = {
  keepAlive: true,
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE
};
mongoose.connect(process.env.MONGODB_URI, options)
  .then(() => {
    console.log('Connected to Mongo!');
    return Service.remove({});
  })
  .then(() => {
    console.log('Empty db');
    return Service.insertMany(data);
  })
  .then((results) => {
    console.log('You have some services', results.length);
    mongoose.connection.close();
  })
  .catch((error) => {
    console.log('There is a problem', error);
  });
