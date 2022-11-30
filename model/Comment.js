const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {Post} = require('./Post');
const { Reply } = require('./Reply');
const {User} = require('./User');
const CommentSchema = new mongoose.Schema({
    content:{
        type: String,
        require: true,
        minlength: 1,
        maxlength: 500
    },
    reply:{
        type: Number,
        default: 0
    },
    listRep:[{
        type: Schema.Types.ObjectId,
        ref: Reply
    }],
    like:{
        type: Number,
        default: 0
    },
    postID:{
        type: Schema.Types.ObjectId,
        ref: Post
    },
    userID:{
        type: Schema.Types.ObjectId,
        ref: User
    },
    dateCreate:{
        type: Date,
        default: Date.now
    }
});
const Comment = mongoose.model('Comment',CommentSchema)
function validateComment(comment){
    const schema = Joi.object({
        content: Joi.string().min(1).max(500).required(),
        // userID: Joi.objectId().required(),
        postID: Joi.objectId().required()
    });
    return schema.validate(comment);
}
exports.CommentSchema = CommentSchema;
exports.Comment = Comment;
exports.validateComment = validateComment;
