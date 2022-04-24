
const mongoose = require('mongoose')

const newBorrower = new mongoose.Schema({
    Borrower : {
        type : Object,
        required : true
    },

    Book: {
        type: Object,
        required: true
    },

    dateBorrowed : {
        type: Date,
        default: Date.now()
    },

    dateReturned : {
        type: Date,
        required: true,
    }
})

module.exports = mongoose.model("Borrowers" , newBorrower)

