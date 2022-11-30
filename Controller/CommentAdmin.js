const express = require('express');
const {Comment,validateComment} = require('../model/Comment');
const {Reply,validateReply} = require('../model/Reply')
const mongoose = require('mongoose');
const {Admin} = require('../model/Admin');
const {Post} = require('../model/Post');
const auth = require('../middleware/auth');

//get list cmt + reply theo post
exports.getListCMT = async function GetListCMT(req,res){
    const idpost = req.params.postID;
    if(idpost === 0){
        const listcmt = await Comment.find().populate('userID','name').populate({path:'listRep',populate:{path:'userID',select:'name'}}).sort('-dateCreate');
        res.send(listcmt);
    }else{
        const post = await Post.findById(idpost);
        if(!post) return res.status(404).send("Not availble");
        const listcmt = await Comment.find({postID:idpost}).populate('userID','name').populate({path:'listRep',populate:{path:'userID',select:'name'}}).sort('-dateCreate');
        res.send(listcmt);
    }
}
// delete cmt
exports.deleteCMT = async function DeleteCMT(req,res){
    const idcmt = req.params.commentID;
    const session = await mongoose.startSession();
    try{
        session.startTransaction();
        // chưa thêm session được vì bị lỗi 
        const cmt = await Comment.findByIdAndRemove(idcmt);
        if(!cmt) return res.status(404).send('Not availble');
        await Reply.deleteMany({_id:cmt.listRep});
        await Post.findOneAndUpdate({_id:cmt.postID},{$inc : {'comment' : -1}});
        const listcmt = await Comment.find({postID:cmt.postID}).populate('userID','name').populate({path:'listRep',populate:{path:'userID',select:'name'}}).sort('-dateCreate');
        res.send(listcmt);
        await session.commitTransaction();
    }catch(ex){
        console.log(ex);
        await session.abortTransaction();
    }
    session.endSession();
}
// deleteReply
exports.deleteReply = async function(req,res){
    const idReply = req.params.id;
    const idCMT = req.params.idCMT;
    const session = await mongoose.startSession();
    try{
        session.startTransaction();
        // chưa thêm session được vì bị lỗi 
        const reply = await Reply.findByIdAndRemove(idReply)
        if(!reply) return res.status(404).send('Not availble');
        const cmt = await Comment.findOneAndUpdate({_id:idCMT},{$inc : {'reply' : -1}, $pull: { listRep: reply._id} });
        const listcmt = await Comment.find({postID:cmt.postID}).populate('userID','name').populate({path:'listRep',populate:{path:'userID',select:'name'}}).sort('-dateCreate');
        res.send(listcmt);
        await session.commitTransaction();
    }catch(ex){
        console.log(ex);
        await session.abortTransaction();
    }
    session.endSession();
}