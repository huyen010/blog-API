const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {Comment} = require('./Comment');
const {User} = require('./User');
const {Post} = require('./Post');
const {Reply} = require('./Reply');

const LikeSchema = new mongoose.Schema({
    userID:{
        type: Schema.Types.ObjectId,
        ref: User
    },
    commentID:{
        type: Schema.Types.ObjectId,
        ref: Comment
    },
    postID:{
        type: Schema.Types.ObjectId,
        ref: Post
    },
    replyID:{
        type: Schema.Types.ObjectId,
        ref: Reply
    }
});
const Like = mongoose.model('Like',LikeSchema);
function validateLike(like){
    const schema = Joi.object({
        // userID: Joi.objectId().required(),
        commentID: Joi.objectId(),
        postID: Joi.objectId(),
        replyID: Joi.objectId()
    });
    return schema.validate(like);
}
exports.LikeSchema = LikeSchema;
exports.Like = Like;
exports.validateLike = validateLike;
