'use strict';

const express = require('express');
const router = express.Router();
const Trade = require('../models/trade');

router.post('/:serviceId/create', (req, res, next) => {
  const id = req.params.serviceId;
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  const service = id;
  const consumer = req.session.currentUser;
  const trade = new Trade({ consumer, service });
  trade.save()
    .then(() => {
      res.redirect('/');
    })
    .catch(next);
});

module.exports = router;
