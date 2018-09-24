'use strict';

const express = require('express');
const router = express.Router();
const Trade = require('../models/trade');
const ObjectId = require('mongoose').Types.ObjectId;

router.get('/booked', (req, res, next) => {
  // Check if there is a currentUser
  Trade.find({ consumer: { _id: req.session.currentUser._id } })
    .populate('consumer')
    .populate('service')
    .populate('owner')
    .then((results) => {
      const data = {
        trades: results
      };
      res.render('trades-booked', data);
    })
    .catch(next);
});

router.get('/requested', (req, res, next) => {
  Trade.find({ owner: { _id: req.session.currentUser._id } })
    .populate('consumer')
    .populate('service')
    .populate('owner')
    .then((results) => {
      const data = {
        trades: results
      };
      res.render('trades-requested', data);
    })
    .catch(next);
});

router.post('/:tradeId/accept', (req, res, next) => {
  const id = req.params.tradeId;
  Trade.findByIdAndUpdate(id, { '$set': { 'providerState': 'accepted', 'consumerState': 'accepted' } })
    .then(() => {
      res.redirect('/trades/requested');
    })
    .catch(next);
});

router.post('/:tradeId/confirm', (req, res, next) => {
  const id = req.params.tradeId;
  Trade.findById(id)
    .populate('owner')
    .populate('consumer')
    .then((results) => {
      if (results.owner.id === req.session.currentUser._id) {
        Trade.findByIdAndUpdate(id, { providerState: 'confirmed' })
          .then(() => {
            res.redirect('/trades/requested');
          });
      } else if (results.consumer.id === req.session.currentUser._id) {
        Trade.findByIdAndUpdate(id, { consumerState: 'confirmed' })
          .then(() => {
            res.redirect('/trades/booked');
          });
      } else {
        // something went wrong
        return next('something went wrong');
      }
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
