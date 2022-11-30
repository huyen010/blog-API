const express = require('express');
const {Comment,validateComment} = require('../model/Comment');
const {Reply,validateReply} = require('../model/Reply')
const mongoose = require('mongoose');
const {User} = require('../model/User');
const {Post} = require('../model/Post');
const auth = require('../middleware/auth');

exports.CreateComment = async function CreateComment(req,res){
    const {error} = validateComment(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    let comment = new Comment({
        content: req.body.content,
        // userID : req.body.userID,
        userID: req.user._id,
        postID: req.body.postID
    });
    const session = await mongoose.startSession();
    try{
        session.startTransaction();
        // comment = await comment.save(session);
        // await Post.findOneAndUpdate({_id:comment.postID},{$inc : {'comment' : 1}},{session});
        comment = await comment.save();
        const post = await Post.findOneAndUpdate({_id:comment.postID},{$inc : {'comment' : 1}},{new:true});
        // console.log(data.name);
        await session.commitTransaction();

    }catch(ex){
        console.log(ex);
        await session.abortTransaction();
    }
    session.endSession();
    const listcmt = await Comment.find({postID:comment.postID}).populate('userID','name').populate({path:'listRep',populate:{path:'userID',select:'name'}}).sort('-dateCreate');
    res.send(listcmt);
}

exports.deleteComment = async function deleteComment(req,res){
    const session = await mongoose.startSession();
    try{
        session.startTransaction();
        // const cmt = await Comment.findByIdAndRemove(req.params.id,session);
        const cmt = await Comment.findById(req.params.id);
        if(!cmt) return res.status(404).send('Not availble');
        if(cmt.userID.valueOf() !== req.user._id) return res.status(401).send("Access denied");
        await cmt.delete();
        await Post.findOneAndUpdate({_id:cmt.postID},{$inc : {'comment' : -1}});
        console.log(cmt._id);
        await Reply.deleteMany({_id:cmt.listRep});
        // await cmt.delete(session);
        // await Post.findOneAndUpdate({_id:cmt.postID},{$inc : {'comment' : -1}},{session});
        // await Reply.deleteMany({commentID:cmt._id},{session});
        const liscmt = await Comment.find({postID:cmt.postID}).populate('userID','name').populate({path:'listRep',populate:{path:'userID',select:'name'}}).sort('-dateCreate');
        res.send(liscmt);
        await session.commitTransaction();
    }catch(ex){
        console.log(ex);
        await session.abortTransaction();
    }
    session.endSession();
}

exports.CreateReply = async function CreateReply(req,res){
    const {error} = validateReply(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const commentID = req.body.commentID;
    const cmt = await Comment.findById(commentID).populate('userID','name');
    if(!cmt) return res.status(404).send('Not availble');
    let reply = new Reply({
        content: req.body.content,
        // userID: req.body.userID,
        userID: req.user._id,
    });
    const session = await mongoose.startSession();
    try{
        session.startTransaction();
        // await reply.save(session);
        // await Post.findOneAndUpdate({_id:comment.postID},{$inc : {'comment' : 1}},session);
        await reply.save();
        cmt.listRep.push(reply._id);
        await cmt.save();
        const data = (await reply.populate('userID','name')).userID.name;
        io.to(cmt.userID._id.valueOf()).emit("notification", data + " đã trả lời bình luận của bạn");
        await Comment.findOneAndUpdate({_id:commentID},{$inc : {'reply' : 1}});
        await session.commitTransaction();
    }catch(ex){
        await session.abortTransaction();
        res.status(500).send(ex);
    }
    session.endSession();
    console.log(commentID);
    const listreply = await Comment.findById(commentID).populate('userID','name').populate({path:'listRep',populate:{path:'userID',select:'name'}}).sort('-dateCreate');
    res.send(listreply);
}

exports.DeleteReply = async function DeleteReply(req,res){
    const session = await mongoose.startSession();
    const commentID = req.params.commentID;
    if(!Comment.findById(commentID)) return res.status(404).send('Not availble');
    try{
        session.startTransaction();
        // const reply = await Reply.findByIdAndRemove(req.params.id,session);
        const reply = await Reply.findById(req.params.id);
        if(!reply) return res.status(404).send('Not availble');
        if(reply.userID.valueOf() !== req.user._id) return res.status(401).send('Access denied');
        await reply.delete();
        await Comment.findOneAndUpdate({_id:commentID},{$inc : {'reply' : -1}, $pull: { listRep: reply._id} });
        // await Comment.findOneAndUpdate({_id:reply.commentID},{$inc : {'reply' : -1}},session);
        const listreply = await Comment.findById(commentID).populate('userID','name').populate({path:'listRep',populate:{path:'userID',select:'name'}}).sort('-dateCreate');
        res.send(listreply);
        await session.commitTransaction();
    }catch(ex){
        await session.abortTransaction();
        // res.status(500).send(ex);
    }
    session.endSession();
}