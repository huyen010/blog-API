const {Post, validate} = require('../model/Post'); 
const SlugF = require('../config/slug');
const {Category} = require('../model/Category');
const {User} = require('../model/User');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const express = require('express');
const { Admin } = require('../model/Admin');
const {upload} = require('../config/multer');
const postController = require('../Controller/Post.js')
require('dotenv').config();
const {getKey} = require('../middleware/redis');
const cloudinary = require('../config/storage');
const router = express.Router();
// get list post phân trang
router.get('/page/:number/:idcate',postController.getListPostPage)
// get list post theo cate
router.get('/page/:idcate',postController.getListPost)
// get detail 
router.get('/detail/:id',postController.getPostDetail)
// get list related post 
router.get('/relate/top/:id',async(req,res)=>{
  var post = await Post.find({cate:req.params.id}).limit(process.env.ROW).sort('-dateCreate');
  if(post.length < process.env.ROW){
    const post2 = await Post.find({cate:{$ne:req.params.id}}).sort('-dateCreate').limit(process.env.ROW-post.length);
    console.log(post2.length);
    post = post.concat(post2);
  }
  res.send(post);
})
router.post('/upload',upload.array('image',2), async(req,res)=>{
  console.log('1');
  const files = req.files;
  const urls = [];
  for (const file of files){
    const result = await cloudinary.uploader.upload(file.path,{
      public_id: `${Date.now()}`,
      resource_type: "auto",
      folder: "images"
    })
    console.log(result)
    urls.push(result.url)
  }
  res.send(urls);
  // url.push(result.url);
  // for(const file of files){
  //   const result = await cloudinary.uploader.upload(file.tempFilePath,{
  //     public_id: `${Date.now()}`,
  //     resource_type: "auto",
  //     folder: "images"
  //   })
  //   url.push(result.url);
  // }
});
module.exports = router;