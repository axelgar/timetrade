'use strict';

const express = require('express');
const router = express.Router();
const Service = require('../models/service');

router.get('/', (req, res, next) => {
  Service.find({})
    .populate('owner')
    .then((results) => {
      const data = {
        services: results
      };
      res.render('services', data);
    })
    .catch(next);
});

router.get('/:serviceId', (req, res, next) => {
  const id = req.params.serviceId;
  Service.findById(id)
    .then((results) => {
      const data = {
        service: results
      };
      res.render('service-details', data);
    })
    .catch(next);
});

module.exports = router;
