const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
require('dotenv').config();
const { User,validate } = require("../model/User");
const userController = require("../Controller/User");
const _ = require('lodash');
const bcrypt = require('bcrypt');
const router = express.Router();
//
// router.get('/account/',auth,async(req,res)=>{
//     console.log(req.user._id);
//     const user = await User.findById(req.user._id).select('-password');
//     res.send(user);
// })

// thêm user mới
router.post('/sign-up',userController.SignUp)
// user cap nhap thong tin
router.put('/update-myacc',auth,userController.updateAccount);
//user cap nhap mat khau
router.put('/update-pass',auth,userController.updatePassWord)
module.exports = router;
