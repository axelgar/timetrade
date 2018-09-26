'use strict';

const express = require('express');
const uploadCloud = require('../services/cloudinary.js');
const router = express.Router();
const Service = require('../models/service');
const ObjectId = require('mongoose').Types.ObjectId;

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

router.get('/create', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  const formData = req.flash('service-form-data');
  const formErrors = req.flash('service-form-error');
  const data = {
    message: formErrors[0],
    fields: formData[0]
  };
  res.render('service-create', data);
});

router.post('/create', uploadCloud.single('photo'), (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  const { name, description, category, time } = req.body;
  if (!req.file || !name || !description || !category || !time) {
    req.flash('service-form-error', 'all fields are mandatory');
    req.flash('service-form-data', { name, description, category, time });
    return res.redirect('/services/create');
  }
  const url = req.file.url;
  const owner = req.session.currentUser;
  const service = new Service({ owner, name, description, category, time, url });
  service.save()
    .then(() => {
      res.redirect('/services');
    })
    .catch(next);
});

router.get('/:serviceId', (req, res, next) => {
  const id = req.params.serviceId;
  if (!ObjectId.isValid(id)) {
    next();
  }
  Service.findOne({ _id: id })
    .populate('owner')
    .then((results) => {
      const coinsError = req.flash('coins-book-error');
      const data = {
        service: results,
        message: coinsError[0]
      };
      res.render('service-details', data);
    })
    .catch(next);
});

module.exports = router;
