'use strict';

require('dotenv').config();

const mongoose = require('mongoose');

const data = require('../../data/services.js');
const Service = require('../../models/service.js');
const Owner = require('../../models/user.js');

function updateOwner (owner, service, index) {
  return Owner.findOne({ username: owner })
    .then((result) => {
      if (!result) {
        throw new Error('Unknown result ' + owner);
      }
      service.owner[index] = result._id;
    });
}
function updateOwnerId (service) {
  const promisesOfUpdatingServiceOwnerId = service.owner.map((owner, index) => updateOwner(owner, service, index));
  return Promise.all(promisesOfUpdatingServiceOwnerId);
}

const options = {
  keepAlive: true,
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE
};

mongoose.connect(process.env.MONGODB_URI, options)
  .then(() => {
    console.log('Connected to Mongo!');
    return Service.deleteMany({});
  })
  .then(() => {
    const promisesOfUpdatingServiceOwner = data.map((service) => updateOwnerId(service));
    return Promise.all(promisesOfUpdatingServiceOwner);
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
