const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        enum: ["Mr", "Mrs", "Miss"],
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: Number,
        unique:true,
        required: true,
        trim: true

    },
    email: {
        type: String,
        unique:true,
        required: true,
        trim: true

    },
    password: {
        type: String,
        unique:true,
        required: true,
        trim: true,
        minLen: 8, 
        maxLen: 15

    },
    address:{
        street: { 
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        pincode: {
            type: String,
            required: true,
            trim: true
        }   
    },
    createdAt: Date,

    updatedAt: Date

}, { timestamps: true });


module.exports = mongoose.model("User", userSchema)