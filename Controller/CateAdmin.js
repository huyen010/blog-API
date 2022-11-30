const express = require('express');
const {Category,validate} = require('../model/Category');
const mongoose = require('mongoose');
const SlugF = require('../config/slug');
const router = express.Router();
const auth = require('../middleware/auth');

exports.GetListCate = async function GetlistCate(req,res){
    const categories = await Category.find().sort('name');
    res.send(categories);
}
exports.GetCateDetail = async function GetCateDetail(req,res){
    const category = await Category.findById(req.params.id);
    if(!category) return res.status(404).send('Not availble');
    res.send(category);
}
exports.InsertCate = async function InsertCate(req,res){
    const sl = await SlugF(req.body.name);
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    let cate = new Category({name: req.body.name,slug:sl});
    cate =  await cate.save();
    res.send(cate);
}
exports.UpdateCate = async function UpdateCate(req,res){
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const cate = await Category.findByIdAndUpdate(req.params.id,{name:req.body.name},{new:true});
    if(!cate) return res.status(404).send('Not availble');
    res.send(cate);
}
exports.deleteCate = async function DeleteCate(req,res){
    const cate = await Category.findByIdAndRemove(req.params.id);
    if(!cate) return res.status(404).send('Not availble');
    res.send('Success');
}