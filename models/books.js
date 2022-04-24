
const mongoose = require('mongoose')

const newBook = new mongoose.Schema( {
    title: {
        type: String,
        required: true,
        minlength: 5,
    },

    author: {
        type: String,
        required: true,
        minlength: 5,
    },

    category : {
        type: String,
        required: true,
        minlength :  5
    },

    dateCreated: {
        type: Date,
        default: Date.now()
    }


})

module.exports = mongoose.model("Books" , newBook)