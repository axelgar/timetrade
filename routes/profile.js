'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Service = require('../models/service');
const ObjectId = require('mongoose').Types.ObjectId;

router.get('/:userId', (req, res, next) => {
  const userId = req.params.userId;
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  User.findById(userId)
    .then((user) => {
      Service.find({ owner: ObjectId(userId) })
        .then((services) => {
          let isMyProfile = false;
          if (req.session.currentUser._id === userId) {
            isMyProfile = true;
          }
          const data = {
            user,
            services,
            isMyProfile
          };
          res.render('profile', data);
        });
    })
    .catch(next);
});

module.exports = router;
