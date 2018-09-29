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
      const data = {
        trades: results,
        trade: true
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
  const tradeId = req.params.tradeId;
  if (!ObjectId.isValid(tradeId)) {
    return next();
  };

  const id = req.session.currentUser._id;
  Trade.findById(tradeId)
    .then((result) => {
      if (!result.owner.equals(id) || result.providerState !== 'booked') {
        return res.redirect('/trades/requested');
      }
      return Trade.findByIdAndUpdate(tradeId, { '$set': { 'providerState': 'accepted', 'consumerState': 'accepted' } });
    })
    .then(() => {
      res.redirect('/trades/requested');
    })
    .catch(next);
});

router.post('/:tradeId/reject', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  const tradeId = req.params.tradeId;
  if (!ObjectId.isValid(tradeId)) {
    return next();
  }

  Trade.findByIdAndUpdate(tradeId, { '$set': { 'providerState': 'rejected', 'consumerState': 'rejected' } })
    .populate('service')
    .then((result) => {
      const time = result.service.time;
      if (result.service.owner.equals(req.session.currentUser._id)) {
        return User.findByIdAndUpdate(result.consumer._id, { $inc: { coins: time } }, { new: true })
        .then(() => {
          return res.redirect('/services');
        });
      } else {
        return User.findByIdAndUpdate(result.consumer._id, { $inc: { coins: time } }, { new: true })
        .then((user) => {
          req.session.currentUser = user;
          return res.redirect('/services');
        });
      }
    })
  .catch(next);
});

router.post('/:tradeId/confirm', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  const tradeId = req.params.tradeId;
  if (!ObjectId.isValid(tradeId)) {
    return next();
  };

  Trade.findById(tradeId)
    .then((result) => {
      if (result.providerState === 'booked') {
        return res.redirect('/trades/requested');
      }
      if (result.owner.equals(req.session.currentUser._id)) {
        Trade.findByIdAndUpdate(tradeId, { providerState: 'confirmed' }, { new: true })
          .populate('service')
          .then((result) => {
            const providerId = result.owner;
            const time = Number(result.service.time);
            if (result.consumerState === 'confirmed' && result.providerState === 'confirmed') {
              User.findOneAndUpdate({ _id: ObjectId(providerId) }, { $inc: { coins: time } }, { new: true })
              .then((user) => {
                req.session.currentUser = user;
                return res.redirect('/trades/requested');
              })
            } else {
              return res.redirect('/trades/requested');
            }
          })
      } else if (result.consumer.equals(req.session.currentUser._id)) {
        Trade.findByIdAndUpdate(tradeId, { consumerState: 'confirmed' }, { new: true })
          .populate('service')
          .then((result) => {
            const providerId = result.owner;
            const time = Number(result.service.time);
            if (result.consumerState === 'confirmed' && result.providerState === 'confirmed') {
              User.findOneAndUpdate({ '_id': ObjectId(providerId) }, { $inc: { coins: time } })
              .then(() => {
                return res.redirect('/trades/booked');
              });
            } else {
              return res.redirect('/trades/booked');
            }
          })
      }
    })
  .catch(next);
});

router.post('/:serviceId/:ownerId/create', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/services/' + id);
  };
  const id = req.params.serviceId;
  if (!ObjectId.isValid(id)) {
    return next();
  };

  const ido = req.params.ownerId;
  const userId = req.session.currentUser._id;
  User.findById(userId)
    .then((result) => {
      if (result.id === ido) {
        req.flash('coins-book-error', 'Your are the provider of this service');
        return res.redirect('/services/' + id);
      }
      const coins = result.coins;
      return Service.findById(id)
        .then((result) => {
          const time = Number(result.time);
          if (coins < time) {
            req.flash('coins-book-error', 'We are sorry but you do not have enough time');
            return res.redirect('/services/' + id);
          }
          return User.findByIdAndUpdate({ '_id': ObjectId(userId) }, { $inc: { coins: -time } }, { new: true });
        })
        .then((user) => {
          const owner = ido;
          const service = id;
          const consumer = req.session.currentUser;
          const trade = new Trade({ consumer, service, owner });
          req.session.currentUser = user;
          return trade.save();
        })
        .then(() => {
          res.redirect('/trades/booked');
        })
    })
    .catch(next);
});

module.exports = router;
