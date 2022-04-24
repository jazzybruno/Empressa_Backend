const mongoose = require('mongoose')
const jwt  = require('jsonwebtoken')
const { toUpper } = require('lodash')

const newUser = new mongoose.Schema( {
    name: { 
        type: String,
        required: true,
        minlength: 10,
        maxlength: 30,
    },
    username:{
        type: String,
        required: true,
        unique: toUpper,
        minlength: 5,
        maxlength: 10,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true
    },

    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
})

newUser.methods.genAuthToken = function() {
    
const token = jwt.sign({ name: this.name , email: this.email , username: this.username , password: this.password , isAdmin: this.isAdmin  } , 'Bruno@1980')
return token
}

   

module.exports = mongoose.model('users' , newUser)
