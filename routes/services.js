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

router.post('/create', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  const { name, description, category, time } = req.body;
  if (!name || !description || !category || !time) {
    req.flash('service-form-error', 'all fields are mandatory');
    req.flash('service-form-data', { name, description, category, time });
    return res.redirect('/services/create');
  }
  const owner = req.session.currentUser;
  const service = new Service({ owner, name, description, category, time });
  service.save()
    .then(() => {
      res.redirect('/services');
    })
    .catch(next);
});

router.get('/:serviceId', (req, res, next) => {
  const id = req.params.serviceId;
  Service.findById(id)
    .populate('owner')
    .then((results) => {
      const data = {
        service: results
      };
      res.render('service-details', data);
    })
    .catch(next);
});

module.exports = router;
