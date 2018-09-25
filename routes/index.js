'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user');

/* GET home page. */
router.get('/', (req, res, next) => {
  if (req.session.currentUser) {
    User.findById(req.session.currentUser.id)
      .then((results) => {
        const data = {
          user: results,
          title: 'TimeTrade'
        };
        res.render('index', data);
      })
      .catch(next);
  } else {
    res.render('index', { title: 'TimeTrade' });
  }
});

module.exports = router;
