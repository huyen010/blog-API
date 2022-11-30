const {Post, validate} = require('../model/Post'); 
const SlugF = require('../config/slug');
const {Category} = require('../model/Category');
const CheckRole = require('../middleware/admin');
const {User} = require('../model/User');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const express = require('express');
const multer = require('multer');
// const cloudinary = require('cloudinary').v2
// const streamifier = require('streamifier')
const { Admin } = require('../model/Admin');
const postController = require('../Controller/PostAdmin');
require('dotenv').config();
const router = express.Router();

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//       cb(null, './uploads/');
//     },
//     filename: function(req, file, cb) {
//       cb(null, Date.now() + file.originalname);
//     }
// });
  
// const fileFilter = (req, file, cb) => {
//     // reject a file
//     if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
//       cb(null, true);
//     } else {
//       cb(null, false);
//     }
// };
// const upload = multer({
//     storage: storage,
//     limits: {
//       fileSize: 1024 * 1024 * 5
//     },
//     fileFilter: fileFilter
// });

// get list post phân trang
router.get('/page/:number/:idcate',auth,CheckRole('readAny','Post'),postController.getListPostPage)
// get list post theo cate
router.get('/page/:idcate',auth,CheckRole('readAny','Post'),postController.getListPost)
// create post
// router.post('/create',auth,CheckRole('createAny','Post'),upload.single("image"),postController.CreatPost)
// update post
// router.put('/update/:id',auth,CheckRole('updateAny','Post'),upload.single("image"),postController.updatePost)
// delete post
router.delete('/delete/:id',auth,CheckRole('deleteAny','Post'),postController.deletePost)
// get detail 
router.get('/detail/:id',auth,CheckRole('readAny','Post'),postController.getPostDetail)
// get list related post 
router.get('/relate/top/:id',auth,CheckRole('readAny','Post'),postController.getRelatedPost)
module.exports = router;