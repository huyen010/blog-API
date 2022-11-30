const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
// const config = require('config');
const Joi = require('joi');
const _ = require('lodash')
const {User} = require('../model/User');
const {Admin} = require('../model/Admin');
const mongoose = require('mongoose');
const express = require('express');
const { trim } = require('lodash');

exports.Login = async function Login(req,res){
    
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    // let user = new User({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password
    // })
    const username = trim(req.body.username).toLowerCase();
    let admin = await Admin.findOne({username:username});
    if(!admin ) return res.status(400).send('Invalid username or password');
    const validPassword = await bcrypt.compare(req.body.password,admin.password);
    if(!validPassword) return res.status(400).send('Invalid username or password');
    const token = await admin.generateAuthToken();
    res.send(token);
}

exports.RefreshToken = async function RefreshToken(req,res){
    const refreshToken = req.body.token;
    console.log(refreshToken);
    // console.log(refreshToken);
    if (!refreshToken) return res.send('No token provide');
    // admin = await Admin.findOne({_id:req.user._id, 'tokens.token':refreshToken});
    // if (!admin) res.sendStatus(403);
    try{
        const decoded = jwt.verify(refreshToken, process.env.RefreshToken);
        req.user = decoded;
        // console.log(req.user);
        // const token = jwt.sign({ _id: req.user._id, isAdmin: req.user.isAdmin},process.env.SecrectToken,{expiresIn: "60s"});
        const token = jwt.sign({ _id: req.user._id, role: req.user.role},process.env.SecrectToken);
        res.send(token);
    }
    catch(ex){
        res.status(400).send('Invalid token');
    }
}

function validate(req){
    const schema = Joi.object({
        username: Joi.string().min(10).max(100).required(),
        password: Joi.string().min(6).max(100).required()
    })
    return schema.validate(req)
}