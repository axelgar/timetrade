'use strict';

const express = require('express');
const router = express.Router();
const Trade = require('../models/trade');
const User = require('../models/user');
const Service = require('../models/service');
const ObjectId = require('mongoose').Types.ObjectId;

router.get('/booked', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  Trade.find({ consumer: { _id: req.session.currentUser._id } })
    .populate('consumer')
    .populate('service')
    .populate('owner')
    .then((results) => {
      results.forEach(trade => {
        if (trade.consumerState === 'accepted' || trade.consumerState === 'confirmed') {
          trade.isAccepted = true;
        }
      });
      const data = {
        trades: results
      };
      res.render('trades-booked', data);
    })
    .catch(next);
});

router.get('/requested', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  Trade.find({ owner: { _id: req.session.currentUser._id } })
    .populate('consumer')
    .populate('service')
    .populate('owner')
    .then((results) => {
      results.forEach(trade => {
        if (trade.providerState === 'accepted' || trade.providerState === 'confirmed') {
          trade.isAccepted = true;
        }
      });
      const data = {
        trades: results
      };
      res.render('trades-requested', data);
    })
    .catch(next);
});

router.post('/:tradeId/accept', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  const tradeid = req.params.tradeId;
  Trade.findByIdAndUpdate(tradeid, { '$set': { 'providerState': 'accepted', 'consumerState': 'accepted' } })
    .then(() => {
      res.redirect('/trades/requested');
    })
    .catch(next);
});

router.post('/:tradeId/confirm', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  const id = req.params.tradeId;
  Trade.findById(id)
    .populate('owner')
    .populate('consumer')
    .populate('service')
    .then((results) => {
      if (results.providerState === 'booked') {
        return res.redirect('/trades/request');
      }
      if (results.owner.id === req.session.currentUser._id) {
        Trade.findByIdAndUpdate(id, { providerState: 'confirmed' }, { new: true })
          .populate('service')
          .populate('owner')
          .populate('consumer')
          .then((results) => {
            const providerId = results.owner.id;
            const time = Number(results.service.time);
            if (results.consumerState === 'confirmed' && results.providerState === 'confirmed') {
              User.findOneAndUpdate({ '_id': ObjectId(providerId) }, { $inc: { coins: time } })
                .then(() => {
                });
            }
            return res.redirect('/trades/requested');
          });
      } else if (results.consumer.id === req.session.currentUser._id) {
        Trade.findByIdAndUpdate(id, { consumerState: 'confirmed' }, { new: true })
          .populate('service')
          .populate('owner')
          .populate('consumer')
          .then((results) => {
            const providerId = results.owner.id;
            const time = Number(results.service.time);
            if (results.consumerState === 'confirmed' && results.providerState === 'confirmed') {
              User.findOneAndUpdate({ '_id': ObjectId(providerId) }, { $inc: { coins: time } })
                .then(() => {
                });
            }
            return res.redirect('/trades/booked');
          });
      } else {
        return next('something went wrong');
      }
    })
    .catch(next);
});

router.post('/:serviceId/:ownerId/create', (req, res, next) => {
  const userId = req.session.currentUser._id;
  const id = req.params.serviceId;
  const ido = req.params.ownerId;
  if (!req.session.currentUser) {
    return res.redirect('/services/id');
  };
  if (!ObjectId.isValid(id)) {
    return res.redirect('/services/id');
  };
  User.findById(userId)
    .then((results) => {
      const coins = results.coins;
      Service.findById(id)
        .then((result) => {
          const time = Number(result.time);
          if (coins < time) {
            req.flash('coins-book-error', 'We are sorry but you do not have enough time');
            return res.redirect('/services/' + id);
          }
          User.findByIdAndUpdate({ '_id': ObjectId(userId) }, { $inc: { coins: -time } })
            .then(() => {
              const owner = ido;
              const service = id;
              const consumer = req.session.currentUser;
              const trade = new Trade({ consumer, service, owner });
              trade.save()
                .then(() => {
                  res.redirect('/services');
                });
            });
        });
    })
    .catch(next);
});

module.exports = router;
