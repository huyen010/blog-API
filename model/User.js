const Joi = require('joi');
// const config = require('config');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlength: 6,
        maxlength: 100
    },
    email:{
        type: String,
        require: true,
        minlength: 10,
        maxlength: 100,
        unique: true
    },
    password:{
        type: String, 
        require: true,
        minlength: 6,
        maxlength: 100
    },
    tokens: {
        type: [String]
    }
    // isAdmin: Boolean
});
userSchema.methods.generateAuthToken = async function(){
    const user = this;
    // const token = jwt.sign({ _id: this._id},process.env.SecrectToken,{expiresIn: "60s"});
    const token = jwt.sign({ _id: this._id},process.env.SecrectToken);
    // const refreshtoken = jwt.sign({ _id: this._id},process.env.RefreshToken);
    // user.tokens.push(refreshtoken);
    await user.save();
    // return {token,refreshtoken};
    return {token}
}
const User = mongoose.model('user',userSchema)
function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().min(6).max(255).required(),
        email: Joi.string().min(10).max(255).required().email(),
        password: Joi.string().min(6).max(255).required(),
    })
    return schema.validate(user);
}
exports.userSchema = userSchema;
exports.User = User;
exports.validate = validateUser;

