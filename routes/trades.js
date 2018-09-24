'use strict';

const express = require('express');
const router = express.Router();
const Trade = require('../models/trade');
const ObjectId = require('mongoose').Types.ObjectId;

router.get('/', (req, res, next) => {
  Trade.find({ $or: [{ consumer: { _id: req.session.currentUser._id } }, { owner: { _id: req.session.currentUser._id } }] })
    .populate('consumer')
    .populate('service')
    .populate('owner')
    .then((results) => {
      const data = {
        trades: results
      };
      res.render('trades-mine', data);
    })
    .catch(next);
});

router.post('/:serviceId/:ownerId/create', (req, res, next) => {
  const id = req.params.serviceId;
  const ido = req.params.ownerId;

  if (!req.session.currentUser) {
    return res.redirect('/services/id');
  }

  if (!ObjectId.isValid(id)) {
    return res.redirect('/services/id');
  }

  // Service.findById(id)
  //   .populate('owner')
  //   .then((result) => {
  //     if (req.session.currentUser === result.owner[0]) {
  //       return res.redirect('/services/id');
  //     }
  const owner = ido;
  const service = id;
  const consumer = req.session.currentUser;
  const trade = new Trade({ consumer, service, owner });
  trade.save()
    .then(() => {
      res.redirect('/services');
    })
    .catch(next);
  // });
});

module.exports = router;
