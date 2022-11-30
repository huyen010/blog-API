const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const CheckRole = require('../middleware/admin');
require('dotenv').config();
const { User,validate } = require("../model/User");
const {Admin, validateAdmin} = require("../model/Admin");
const _ = require('lodash');
const bcrypt = require('bcrypt');
const router = express.Router();
const adminController = require("../Controller/Admin");
//admin thêm role
router.post('/role/create',auth, CheckRole('createAny','Role'),adminController.CreateRole)
//phân trang danh sách người dùng
router.get('/page/:number',auth,CheckRole('readAny','User'), adminController.GetListUser )
// get admin bằng id
router.get('/detail/:id',auth, CheckRole('readAny','User'),adminController.getDetailUser)
// update admin
router.put('/update/:id',auth,CheckRole('updateAny','User'),adminController.updateUser)
// thêm admin
router.post('/insert',auth,CheckRole('createAny','User'),adminController.InsertUser)
//xóa admin
router.delete('/delete/:id',auth,CheckRole('deleteAny','User'),adminController.DeleteUser)
//update password
router.put('/update-password/:id',auth,CheckRole('updateAny','User'),adminController.updateUserPassword)
// user tự update Password
router.put('/update-mypass', auth,CheckRole('updateOwn','User'), adminController.updateMyPassword);
module.exports = router; 