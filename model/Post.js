const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { join } = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {CateSchema, Category} = require('./Category');
const{userSchema,User} = require('./User');
const {Admin} = require('./Admin');
const Post = mongoose.model('Post', new mongoose.Schema({
    title:{
        type: String,
        required:true,
        trim: true,
        minlength:10,
        maxlength: 200,
    },
    description:{
        type: String,
        required: true,
        minlength: 100,
        maxlength: 5000
    },
    status:{
        type: Boolean,
        default: false
    },
    image:{
        type: String, 
    },
    tag:{
        type: [String],
        required: true
    },
    cate:{
        type: Schema.Types.ObjectId,
        ref: Category
    },
    dateCreate:{
        type: Date,
        default: Date.now
    },
    like:{
        type: Number,
        default: 0
    },
    comment:{
        type: Number,
        default: 0
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: Admin
    },
    file:{
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true
    }
}));
function validatePost(post){
    const schema = Joi.object({
        title: Joi.string().min(10).max(100).required(),
        cateID: Joi.objectId().required(),
        tag: Joi.array().min(1).required(),
        // userID: Joi.objectId().required(),
        description: Joi.string().min(100).max(5000).required(),
        file: Joi.string().required()
        // image: Joi.required()
    })
    return schema.validate(post);
}
exports.Post = Post;
exports.validate = validatePost;