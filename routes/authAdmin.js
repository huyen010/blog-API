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
const autAdmin = require('../Controller/authAdmin')
const router = express.Router();
//đăng nhập admin
router.post('/log-in',autAdmin.Login);

// refresh token cho admin
router.post('/refreshToken',autAdmin.RefreshToken);
module.exports = router;