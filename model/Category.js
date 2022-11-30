const Joi = require('joi');
const mongoose = require('mongoose');
const CateSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
        minlength: 10,
        maxlength: 100,
        unique: true
    },
    count:{
        type: Number,
        default: 0
    },
    slug:{
        type: String,
        require: true
    }
});
const Category = mongoose.model('Category',CateSchema)
function validateCate(category){
    const schema = Joi.object({
        name: Joi.string().min(10).max(100).required()
    });
    return schema.validate(category)
}
exports.CateSchema = CateSchema;
exports.Category = Category;
exports.validate = validateCate;
