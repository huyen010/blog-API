const {Post, validate} = require('../model/Post'); 
const {Comment} = require('../model/Comment');
const SlugF = require('../config/slug');
const {Category} = require('../model/Category');
const {User} = require('../model/User');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const express = require('express');
const multer = require('multer');
const { Admin } = require('../model/Admin');
require('dotenv').config();
exports.getListPostPage = async function getList(req,res){
    // post_1_10: post
    const nb = req.params.number;
    var row = process.env.ROW;
    const key = 'listPost' + nb + req.params.idcate;
    const data = await getKey(key);
    if(data !== null) return res.send(data);
    var post = undefined;
    if(!Number(nb)) return res.status(400).send('So trang khong hop le');
    if(req.params.idcate != 0){
        cate = Category.findById(req.params.idcate);
        if(!cate) return res.status(404).send('Not availble');
        post = await Post.find({cate:req.params.idcate}).limit(row).skip((nb-1)*row).sort('dateCreate').populate('user',['name','email']).populate('cate','name');
    }else{
        post = await Post.find().limit(row).skip((nb-1)*row).sort('dateCreate').populate('user',['name','email']).populate('cate','name');
    }
    await setKey(key,60,JSON.stringify(post));
    res.send(post);
}

exports.getListPost = async function (req,res){
    nb = req.params.number;
    if(req.params.idcate != 0){
        cate = Category.findById(req.params.idcate);
        if(!cate) return res.status(404).send('Not availble');
        const post = await Post.find({cate:req.params.idcate}).sort('dateCreate').populate('user',['name','email']).populate('cate','name');
    }else{
        const post = await Post.find().sort('dateCreate').populate('user',['name','email']).populate('cate','name');
    }
    res.send(post);
}
//up load
exports.CreatPost = async function(req,res){
    const sl = await SlugF(req.body.title,1);
    const{error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    // let us = await Admin.findById(req.body.userID);
    // if(!us) return res.status(400).send('Người đăng không tồn tại');
    let cate = await Category.findById(req.body.cateID);
    if(!cate) return  res.status(400).send('Chọn danh muc');
    const session = await mongoose.startSession();
    let post = new Post({
        title: req.body.title,
        user: req.user._id,
        tag: req.body.tag,
        cate: req.body.cateID,
        image: req.file.path,
        description: req.body.description,
        file: req.body.file,
        slug: sl
    });
    try{
        session.startTransaction();
    //   post = await post.save(session);
    //   await Category.findOneAndUpdate({_id :post.cate}, {$inc : {'count' : 1}},session)
        post = await post.save();
        await Category.findOneAndUpdate({_id :post.cate}, {$inc : {'count' : 1}},{new:true});
        await session.commitTransaction();
        // redisClient.del('listPost', function(err, reply){
        //     console.log(reply);
        // })
        // redisClient.keys('listPost',function(err, rows){
        //     for(var i = 0 ; i < rows.length; i++){
        //         console.log(rows[i]);
        //     }
        // })
        res.send(post);
    }catch(ex){
        await session.abortTransaction();
        res.send(ex)
    }
    session.endSession();
}

exports.updatePost = async function (req,res){
    sl = await SlugF(req.body.title,1);
    const{error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    // let us = await Admin.findById(req.body.userID);
    // if(!us) return res.status(400).send('Người đăng không tồn tại');
    let cate = await Category.findById(req.body.cateID);
    if(!cate) return  res.status(400).send('Chọn danh muc');
    let post = new Post({
        title: req.body.title,
        user: req.user._id,
        tag: req.body.tag,
        cate: req.body.cateID,
        image: req.file.path,
        description: req.body.description,
        file: req.body.file,
        slug: sl
    });
    post = await Post.findByIdAndUpdate(req.params.id,{title:post.title,tag:post.tag,file:post.file,description:post.description,image:post.image,slug:sl},{new:true});
    res.send(post);
}

exports.deletePost = async function(req,res){
    const session = await mongoose.startSession();
    try{
        session.startTransaction();
        // const post = await Post.findByIdAndRemove(req.params.id).session(session);
        // await Category.findOneAndUpdate({_id :post.cate}, {$inc : {'count' : -1}},session)
        const post = await Post.findByIdAndRemove(req.params.id);
        await Comment.deleteMany({postID:post._id});
        await Category.findOneAndUpdate({_id :post.cate}, {$inc : {'count' : -1}})
        await session.commitTransaction();
        res.send("Success");
    }catch(ex){
        console.log(ex);
        await session.abortTransaction();
        res.send(ex)
    }
    session.endSession();
}

exports.getPostDetail = async function(req,res){
    const post = await Post.findById(req.params.id);
    res.send(post);
}
exports.getRelatedPost = async function(req,res){
    const post = await Post.find({cate:req.params.id}).limit(process.env.ROW).sort('-dateCreate');
    res.send(post);
}