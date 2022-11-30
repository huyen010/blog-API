const {Comment} = require('../model/Comment');
const {Reply} = require('../model/Reply')
const {Post} = require('../model/Post')
const {Like,validateLike} = require('../model/Like')
const likeController = require('../Controller/Like');
const mongoose = require('mongoose');
const {User} = require('../model/User');
const auth = require('../middleware/auth');
const { valid } = require('joi');
const express = require('express');

async function CheckLike(check, userid, like,res){
    let l = undefined;
    if(check == 1){
        l = await Like.findOne({userID: userid, commentID: like});
    }
    if(check == 2 ){
        l = await Like.findOne({userID:userid,postID: like});
    }
    if(check == 3){
        l = await Like.findOne({userID:userid,replyID: like});
    }
    if(l){
        await UnLike(l._id,check,res);
        return 0;
    }
    return 1;
}
async function UnLike(like,check,res){
    const session = await mongoose.startSession();
    try{
        session.startTransaction();
        if(check == 1){
            like = await Like.findByIdAndRemove(like._id).session(session);
            const cmt = await Comment.findOneAndUpdate({_id:like.commentID},{$inc : {'like' : -1}}, session);
            return res.send(cmt);
        }
        if(check == 2){
            like = await Like.findByIdAndRemove(like._id);
            const post = await Post.findOneAndUpdate({_id:like.postID},{$inc : {'like' : -1}}, {new:true});
            return res.send(post);
            // like = await Like.findByIdAndRemove(like._id).session(session);
            // const post = await Post.findOneAndUpdate({_id:like.postID},{$inc : {'like' : -1}}, session);
            // res.send(post);
        }
        if(check ==3){
            like = await Like.findByIdAndRemove(like._id).session(session);
            const reply = await Reply.findOneAndUpdate({_id:like.replyID},{$inc : {'like' : -1}}, session);
            return res.send(reply);
        }
        
        await session.commitTransaction();
    }
    catch(ex){
        console.log(ex);
        await session.abortTransaction();
        res.status(500).send(ex);
    }
    session.endSession();
}
exports.LikeReaction = async function LikeReaction(req,res){
    const {error} = validateLike(req.body);
    if(error) res.status(400).send(error.details[0].message);
    const session = await mongoose.startSession();
    let like = new Like({
        userID: req.user._id,
        commentID: req.body.commentID,
        postID: req.body.postID,
        replyID: req.body.replyID
    });
    try{
        session.startTransaction();
        if(like.commentID){
            if(await CheckLike(1,like.userID, like.commentID,res)==1){
                like = await like.save(session);
                const cmt = await Comment.findOneAndUpdate({_id:like.commentID},{$inc : {'like' : 1}}, session);
                return res.send(cmt);
            }
        }
        if(like.postID){
            if(await CheckLike(2,like.userID, like.postID,res)==1){
                // like = await like.save(session);
                // const post = await Post.findOneAndUpdate({_id:like.postID},{$inc : {'like' : 1}},session);
                // res.send(post);
                like = await like.save();
                const post = await Post.findOneAndUpdate({_id:like.postID},{$inc : {'like' : 1}},{new:true});
                return res.send(post);
            }
        }
        if(like.replyID){
            if(await CheckLike(3,like.userID, like.replyID,res)==1){
                like = await like.save(session);
                const reply = await Reply.findOneAndUpdate({_id:like.replyID},{$inc : {'like' : 1}},session);
                return res.send(reply);
            }
        }
        await session.commitTransaction();
    }
    catch(ex){
        console.log(ex);
        await session.abortTransaction();
        res.status(500).send(ex);
    }
    session.endSession();
}