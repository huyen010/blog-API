const {Post, validate} = require('../model/Post'); 
const SlugF = require('../config/slug');
const {Category} = require('../model/Category');
const {User} = require('../model/User');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const express = require('express');
const multer = require('multer');
const { Admin } = require('../model/Admin');
const { getKey,setKey } = require('../middleware/redis');
require('dotenv').config();

exports.getListPostPage = async function getListPostPage(req,res){
    const nb = req.params.number;
    var row = process.env.ROW ;
    const key = 'listPost' + nb + req.params.idcate;
    const data = await getKey(key);
    if(data !== null) return res.send(data);
    var post = undefined;
    if(!Number(nb)) return res.status(400).send('So trang khong hop le');
    if(req.params.idcate != 0){
        const cate = await Category.findOne({_id:req.params.idcate})
        if(!cate) return res.status(404).send('Not availble');
        post = await Post.find({cate:req.params.idcate}).limit(row).skip((nb-1)*row).sort('dateCreate').populate('user',['name','username']).populate('cate','name');
    }else{
        post = await Post.find().limit(row).skip((nb-1)*row).sort('dateCreate').populate('user',['name','username']).populate('cate','name');
    }
    await setKey(key,60,JSON.stringify(post));
    // redisClient.del('listPost*', function(err, reply){
    //     console.log(reply);
    // })
    res.send(post);
}

exports.getListPost = async function GetListPost(req,res){
    const nb = req.params.number;
    var post = undefined
    if(req.params.idcate != 0){
        const cate = await Category.findOne({_id:req.params.idcate});
        console.log(cate);
        if(!cate) res.status(404).send('Not availble');
        // post = await Post.find({cate:req.params.idcate}).populate('user',['name','username']).populate('cate','name').sort('dateCreate');
         post = await Post.find().populate('user',['name','username']).populate('cate','name').sort('dateCreate');
    }else{
        post = await Post.find().populate('user',['name','username']).populate('cate','name').sort('dateCreate');
    }
    res.send(post);
}
exports.getPostDetail = async function GetPostDetail(req,res){
    const key = 'post' + req.params.id;
    const data = await getKey(key);
    if(data !== null) return res.send(data);
    const post = await Post.findById(req.params.id);
    await setKey(key,60,JSON.stringify(post));
    res.send(post);
}
