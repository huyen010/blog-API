const express = require('express');
const {Category,validate} = require('../model/Category');
const CateControlelr = require('../Controller/Category');
const mongoose = require('mongoose');
const SlugF = require('../config/slug');
const router = express.Router();
const auth = require('../middleware/auth');
const {getKey} = require('../middleware/redis');
// get list category
router.get('/',CateControlelr.getListCate)
//get by Id
router.get('/:id',CateControlelr.getCateDetail)
module.exports = router;