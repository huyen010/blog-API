const express = require('express');
const {setKey,getKey} = require('../middleware/redis');
const {Category,validate} = require('../model/Category');
const mongoose = require('mongoose');
const SlugF = require('../config/slug');

exports.getListCate = async function GetListCate(req,res){
    // console.log('1');
    const categories = await Category.find().sort('name');
    redisClient.setEx('listCate', 3600, JSON.stringify(categories));
    // await redisClient.set('listCate',categories);
    // await redisClient.expire('listCate',60);
    res.send(categories);
}

exports.getCateDetail = async function GetCateDetail(req,res){
    
    const category = await Category.findById(req.params.id);
    if(!category) return res.status(404).send('Not availble');
    res.send(category);
}