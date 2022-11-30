const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {Comment} = require('./Comment');
const {User} = require('./User');
const ReplySchema = new mongoose.Schema({
    content:{
        type: String,
        require: true,
        minlength: 1,
        maxlength: 500
    },
    like:{
        type: Number,
        default: 0
    },
    // commentID:{
    //     type: Schema.Types.ObjectId,
    //     ref: Comment
    // },
    userID:{
        type: Schema.Types.ObjectId,
        ref: User
    },
    dateCreate:{
        type: Date,
        default: Date.now
    }
});
const Reply = mongoose.model('Reply',ReplySchema)
function validateReply(reply){
    const schema = Joi.object({
        content: Joi.string().min(1).max(500).required(),
        // userID: Joi.objectId().required(),
        commentID: Joi.objectId().required()
    });
    return schema.validate(reply);
}
exports.ReplySchema = ReplySchema;
exports.Reply = Reply;
exports.validateReply = validateReply;
