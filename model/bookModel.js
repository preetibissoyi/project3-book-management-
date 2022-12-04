const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique:true,
        trim: true
    },
    excerpt: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type:ObjectId,
        ref: 'User',
        required:true

    },
    ISBN: {
        type: String,
        unique:true,
        required: true,
        trim: true

    },
    category:
    {
        type: String,
        required: true
    },
    subcategory:{
        type:[String],
        required:true
    },
    reviews:{
        type: Number,
        required: true,
        default:0
    },
    deletedAt: {
        type: Date, 
        default:null
    },
    isDeleted: {
        type: Boolean, 
        default: false
    },
    releasedAt: { 
        type: Date,  
        required: true
    },
    
    createdAt:Date,

    updatedAt: Date 

}, { timestamps: true });


module.exports = mongoose.model("Book", bookSchema)