const Joi = require('joi');
// const config = require('config');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Role } = require('./Role');
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlength: 6,
        maxlength: 100
    },
    username:{
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
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: Role,
        require: true
    }
});
adminSchema.methods.generateAuthToken = async function(){
    const admin = this;
    // const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin},process.env.SecrectToken,{expiresIn: "60s"});
    // console.log(this.role);
    const token = jwt.sign({ _id: this._id, role: this.role},process.env.SecrectToken);
    const refreshtoken = jwt.sign({ _id: this._id, role: this.role},process.env.RefreshToken);
    admin.tokens.push(refreshtoken);
    await admin.save();
    return {token,refreshtoken};
}
const Admin = mongoose.model('admin',adminSchema);
function validateAdmin(admin){
    const schema = Joi.object({
        name: Joi.string().min(6).max(255).required(),
        username: Joi.string().min(10).max(255).required(),
        password: Joi.string().min(6).max(255).required(),
        role: Joi.objectId().required()
    })
    return schema.validate(admin);
}
exports.validateAdmin = validateAdmin;
exports.Admin = Admin;
exports.adminSchema = adminSchema;

