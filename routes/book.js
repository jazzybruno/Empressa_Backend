const express = require('express')
const router = express.Router()
const Joi = require('joi')
const Book = require('../models/books')
const user = require('../models/user')
const auth = require('../middleware/auth')

router.get('/' , auth, async(req , res)=>{
   const books =  await Book.find()
   if(!books) return res.status(401).send("There are no books in the library")
   res.status(200).send(books)
})

router.get('/:title', auth , async(req ,res)=>{
    const book = await Book.findOne({title: req.params.title})
    if(!book) return res.status(401).send(`The book with the title ${req.params.title} was not found in the library`)
    res.status(200).send(book)
})

router.post('/' ,auth ,  async(req , res)=> {
    const { error } = validate(req.body)
    if(error) return res.status(401).send(error.details[0].message);
    const book = new Book({
    title: req.body.title,
    author: req.body.author,
    category: req.body.category
    })    
    
    await book.save()
    res.status(200).send(book)
})

router.put('/:title' , auth,  async(req , res)=>{
    let  book = await Book.findOne({title: req.params.title})
    if(!book) return res.status(401).send(`The book with the title ${req.params.title} was not found in the library`)
    book.title = req.body.title,
    book.author = req.body.author,
    book.category = req.body.category

    await book.save()
    res.send(book)
} )

router.delete('/:title' ,auth , async(req , res)=>{
    const deleted = await Book.deleteOne({title: req.params.title})
    res.send(deleted)
})

function validate(book){
    const schema = Joi.object({
        title: Joi.string().required().min(5),
        author: Joi.string().required().min(5),
        category: Joi.string().required().min(5),
        dateCreated: Joi.date()
    })
    return schema.validate(book)
}

module.exports = router;

