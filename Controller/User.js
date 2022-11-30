const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const Joi = require('joi');
const { User,validate } = require("../model/User");
const _ = require('lodash');
const bcrypt = require('bcrypt');

exports.SignUp = async function SignUp(req,res){
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const email = (req.body.email).trim().toLowerCase();
    let user = await User.findOne({email: email});
    if(user ) return res.status(400).send('User already registered');
    user = new User(_.pick(req.body,['name','email','password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
    await user.save();
    // const token = user.generateAuthToken();
    // res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
    res.send(_.pick(user, ['_id', 'name', 'email']));
}
exports.updatePassWord = async function updatePassWord(req,res){
    const {error} = ValidatePassword(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const user = await User.findById(req.user._id);
    const validPassword = await bcrypt.compare(req.body.oldpassword,user.password);
    if(!validPassword) return res.status(400).send('Mật khẩu không chính xác');
    if((req.body.newpassword).localeCompare(req.body.checkpass)==0){
        const salt = await bcrypt.genSalt(10);
        pw = await bcrypt.hash(req.body.newpassword,salt);
        user.password = pw;
        await user.save();
        res.send(_.pick(user,['email','name']));
    }else{
        res.status(400).send('Error');
    }
}
exports.updateAccount = async function updateAccount(req,res){
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    console.log(req.user._id);
    const user = await User.findByIdAndUpdate(req.user._id,{name:req.body.name},{new:true})
    if(!user) return res.status(404).send('Not available user');
    res.send(_.pick(user,['email','name']));
}
function ValidatePassword(req){
    const schema = Joi.object({
        oldpassword: Joi.string().min(6).max(100).required(),
        newpassword: Joi.string().min(6).max(100).required(),
        checkpass: Joi.string().min(6).max(100).required()
    })
    return schema.validate(req);
}