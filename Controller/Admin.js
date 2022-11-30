const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/admin');
require('dotenv').config();
const Joi = require('joi');
const { User,validate } = require("../model/User");
const {Admin, validateAdmin} = require("../model/Admin");
const {Role, validateRole} = require("../model/Role")
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { Post } = require('../model/Post');

exports.CreateRole = async function CreateRole(req,res){
    const {error} = validateRole(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const role = new Role({name:req.body.name});
    await role.save();
    res.send(role);
}
exports.GetListUser = async function GetListUser(req,res){
    // console.log(req.user._id);
    // console.log('1');
    var nb = Number(req.params.number);
    var row = Number(process.env.ROW);
    const admin = await Admin.find().limit(row).skip((nb-1)*row).populate('role','name').select('-password').sort('name');
    res.send(admin);
}

exports.getDetailUser = async function GetUserDetail(req,res){
    // reportError.apply.io.emit
    console.log(req.params.id)
    const admin = await Admin.findById(req.params.id).populate('role','name');
    res.send(_.pick(admin,['name','username']));
}

exports.updateUser = async function UpdateUser(req,res){
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const admin = await Admin.findByIdAndUpdate(req.params.id,{name:req.body.name,role:req.body.role},{new:true}).populate('role','name');
    if(!admin) return res.status(404).send('Not available user');
    res.send(_.pick(admin,['username','name']));
}
// super admin đổi mật khẩu của user 
exports.updateUserPassword = async function UpdateUserPassword(req,res){
    // console.log(req.user._id);
    const {error} = validatePassword(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    if((req.body.password).localeCompare(req.body.checkpass)==0){
        const salt = await bcrypt.genSalt(10);
        pw = await bcrypt.hash(req.body.password,salt);
        const admin = await Admin.findByIdAndUpdate(req.params.id,{password:pw}).populate('role','name');
        res.send(_.pick(admin,['username','name']));
    }else{
        res.status(400).send('Error');
    }
}
//editor admin tự đổi mật khẩu
exports.updateMyPassword = async function updateMyPassword(req,res){
    const {error} = validatePassword2(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const admin = await Admin.findById(req.user._id);
    const salt = await bcrypt.genSalt(10);
    const validPassword = await bcrypt.compare(req.body.oldpassword,admin.password);
    if(!validPassword) return res.status(400).send('Mật khẩu không chính xác');
    if((req.body.newpassword).localeCompare(req.body.checkpass)==0){
        pw = await bcrypt.hash(req.body.newpassword,salt);
        admin.password = pw;
        await admin.save();
        res.send(_.pick(admin,['username','name']));
    }else{
        res.status(400).send('Error');
    }
}
exports.InsertUser = async function InsertUser(req,res){
    console.log(req.body.name);
    const {error} = validateAdmin(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const usname = (req.body.username).trim().toLowerCase();
    let admin = await Admin.findOne({username: usname});
    if(admin ) return res.status(400).send('User already registered');
    admin = new Admin(_.pick(req.body,['name','username','password','role']));
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.password,salt);
    admin.username = usname;
    await admin.save();
    // const token = admin.generateAuthToken();
    res.send(_.pick(admin, ['_id', 'name', 'username']));
}

exports.DeleteUser = async function DeleteUser(req,res){
    const admin = await Admin.findByIdAndRemove(req.params.id);
    const post = await Post.find({user:admin._id});
    if(post) res.status(401).send('Không thể xóa');
    if(!admin) res.status(404).send('Not availble');
    res.send('Success');
}

function validatePassword(req){
    const schema = Joi.object({
        password: Joi.string().min(6).max(100).required(),
        checkpass: Joi.string().min(6).max(100).required()
    });
    return schema.validate(req);
}

function validatePassword2(req){
    const schema = Joi.object({
        oldpassword: Joi.string().min(6).max(100).required(),
        newpassword: Joi.string().min(6).max(100).required(),
        checkpass: Joi.string().min(6).max(100).required()
    })
    return schema.validate(req);
}