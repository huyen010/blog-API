const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const config = require('config');
const Joi = require('joi');
const _ = require('lodash')
const auth = require('../middleware/auth');
const {User} = require('../model/User');
const {Admin} = require('../model/Admin');
const mongoose = require('mongoose');
const express = require('express');

exports.Login = async function Login(req,res){
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    // let user = new User({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password
    // })
    const email = (req.body.email).trim().toLowerCase();
    let user = await User.findOne({email: email});
    if(!user ) return res.status(400).send('Invalid email or password');
    const validPassword = await bcrypt.compare(req.body.password,user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password');
    const token = await user.generateAuthToken();
    res.send(token);
}
exports.LogOut = async function LogOut(req,res){
    const refreshtoken = req.body.refreshtoken;
    
}

exports.RefreshToken = async function RefreshToken(req,res){
    const refreshToken = req.body.token;
    if (!refreshToken) res.sendStatus(401);
    // if (!refreshTokens.includes(refreshToken)) res.sendStatus(403);
    try{
        const decoded = jwt.verify(refreshToken, process.env.RefreshToken);
        req.user = decoded;
        // console.log(req.user);
        // const token = jwt.sign({ _id: req.user._id},process.env.SecrectToken,{expiresIn: "60s"});
        const token = jwt.sign({ _id: req.user._id},process.env.SecrectToken);
        res.send(token);
    }
    catch(ex){
        res.status(400).send('Invalid token');
    }  
}
function validate(req){
    const schema = Joi.object({
        email: Joi.string().min(10).max(100).required().email(),
        password: Joi.string().min(6).max(100).required()
    })
    return schema.validate(req)
}