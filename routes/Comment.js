const express = require('express');
const {Comment,validateComment} = require('../model/Comment');
const {Reply,validateReply} = require('../model/Reply')
const mongoose = require('mongoose');
const {User} = require('../model/User');
const CommentController = require('../Controller/Comment');
const {Post} = require('../model/Post');
const auth = require('../middleware/auth');
const CheckAdmin = require('../middleware/admin');
const router = express.Router();

router.post('/create',auth,CommentController.CreateComment)
router.delete('/delete/:id',auth,CommentController.deleteComment)
router.post('/reply/create',auth,CommentController.CreateReply)
router.delete('/reply/delete/:id/:commentID',auth, CommentController.DeleteReply)
module.exports = router;
