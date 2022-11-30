const express = require('express');
const {Comment} = require('../model/Comment');
const {Reply} = require('../model/Reply')
const {Post} = require('../model/Post')
const likeController = require('../Controller/Like');
const mongoose = require('mongoose');
const {User} = require('../model/User');
const auth = require('../middleware/auth');
const { valid } = require('joi');
const router = express.Router();

router.post('/like',auth,likeController.LikeReaction);
module.exports = router;