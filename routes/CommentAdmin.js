const express = require('express');
const {Comment,validateComment} = require('../model/Comment');
const {Reply,validateReply} = require('../model/Reply')
const mongoose = require('mongoose');
const {User} = require('../model/User');
const CommentController = require('../Controller/CommentAdmin');
const {Post} = require('../model/Post');
const auth = require('../middleware/auth');
const CheckRole = require('../middleware/admin');
const router = express.Router();

router.delete('/delete/:commentID',auth,CheckRole('deleteAny','Comment'),CommentController.deleteCMT)
router.get('/post/:postID',auth,CheckRole('readAny','Comment'),CommentController.getListCMT)
router.delete('/reply/delete/:id/:idCMT',auth,CheckRole('deleteAny','Comment'),CommentController.deleteReply)
module.exports = router;
