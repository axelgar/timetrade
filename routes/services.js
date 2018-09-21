'use strict';

const express = require('express');
const router = express.Router();
const Service = require('../models/service');

router.get('/', (req, res, next) => {
  Service.find({})
    .then((results) => {
      const data = {
        services: results
      };
      res.render('services', data);
    })
    .catch(next);
})
;
