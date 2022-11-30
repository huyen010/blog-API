const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const config = require('config');
const Joi = require('joi');
const _ = require('lodash')
const auth = require('../middleware/auth');
const {User} = require('../model/User');
const userController = require('../Controller/authUser');
const {Admin} = require('../model/Admin');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
//đăng nhập admin



// đăng nhập user
router.post('/log-in',userController.Login);
// refresh token user
router.post('/refreshToken',userController.RefreshToken);
module.exports = router;