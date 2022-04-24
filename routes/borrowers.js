const express = require('express')
const User = require('../models/user')
const Book = require('../models/books')
const Borrow = require('..//models/borrowers')
const Joi = require('joi')
const router = express.Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

router.get('/' , [ auth , admin] , async(req , res)=>{
    const borrows = await Borrow.find()
    if(!borrows) return res.status(400).send("There are no borrows")
    res.status(200).send(borrows)
})
, 
router.post('/' , auth , async(req , res)=>{
  const { error } = validate(req.body)
    if(error) return res.status(401).send(error.details[0].message)
    const user = await User.findOne({ email: req.body.email})
    if(!user) return res.status(400).send(`The user with the email ${req.body.email} does not exist `) 
    const book = await Book.findOne({ title: req.body.title})
    if(!book) return res.status(400).send(`The book with the title ${req.body.title} was not found `)
 
    const borrow =  new Borrow({
        Borrower : { 
            name: user.name,
            username: user.username,
            email: user.email
        },

        Book: {
            title: book.title,
            category : book.category
        },

        dateReturned : req.body.return
    })

    borrow.save()
    res.status(200).send(borrow)
})

router.put('/:id' , auth , async(req , res)=>{
    const id = req.params.id
    const { error } = validate(req.body)
    if(error) return res.status(401).send(error.details[0].message)
    const user = await User.findOne({ email: req.body.email})
    if(!user) return res.status(400).send(`The user with the email ${req.body.email} does not exist `) 
    const book = await Book.findOne({ title: req.body.title})
    if(!book) return res.status(400).send(`The book with the title ${req.body.title} was not found `)
    let  borrow = await Borrow.findById(id)

    
        borrow.Borrower = ({ 
            name: user.name,
            username: user.username,
            email: user.email
        }),

        borrow.Book = ({
            title: book.title,
            category : book.category
        }),

        borrow.dateReturned = req.body.return
    

    borrow.save()
    res.status(200).send(borrow)

})

router.delete('/:id' , [auth , admin], async(req, res)=> {
    const id = req.params.id
    const deleted = await Borrow.deleteOne({ _id: id})
    res.status(200).send(deleted)
})

function  validate (borrow) {
    const schema = Joi.object( {
        email: Joi.string().required().email(),
        title: Joi.string().required(),
        dateBorrowed : Joi.date(),
        return: Joi.date().required()
   })
   return schema.validate(borrow)
}

module.exports = router