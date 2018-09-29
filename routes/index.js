'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user');


/* GET home page. */
router.get('/', (req, res, next) => {
  if (req.session.currentUser) {
    User.findById(req.session.currentUser._id)
      .then((results) => {
        const data = {
          user: results,
          title: 'TimeTrade',
          home: true
        };
        res.render('index', data);
      })
      .catch(next);
  } else {
    const data = {
      title: 'TimeTrade',
      home: true
    };
    res.render('index', data);
  }
});

module.exports = router;
