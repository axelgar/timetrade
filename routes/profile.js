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
          const ownerId = ObjectId(services[0].owner._id).toString();
          if (req.session.currentUser._id === ownerId) {
            services.isMyProfile = true;
          }
          const data = {
            user,
            services
          };
          res.render('profile', data);
        });
    })
    .catch(next);
});

module.exports = router;
