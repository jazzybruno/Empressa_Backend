const express = require('express')
const User   = require('../models/user')
const router = express.Router()
const Joi = require('joi')
const passwordComplexity = require('joi-password-complexity')
const bcryptjs =  require('bcryptjs')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

router.get('/'  , [ auth , admin ], async (req , res)=>{
    const user = await  User.find()
    res.send(user)

})

router.get('/:name', auth , async(req , res)=>{
    const name = req.params.name
const user =  await   User.findOne({ username : name})
if(!user) return res.status(401).send(`The user with the username ${name} was not found `)
  res.send(user)
})


router.post('/' , async(req ,res)=>{
    const { error , values} = validate(req.body) 
    if(error) return res.status(400).send(error.details[0].message)
    let user = await User.findOne({email: req.body.email})
    if(user) return res.send("This user already exists")
    user = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        isAdmin : req.body.isAdmin
    })

    const salt = await  bcryptjs.genSalt(10)
    user.password = await bcryptjs.hash( user.password , salt)

    const token =  user.genAuthToken()
    await user.save()
    res.header('x-auth-token' , token).send(user)
    

})

router.put('/:name', auth ,async (req , res)=> {
    const name = req.params.name
    let user = await User.findOne({username: name})
    if(!user) return res.status(401).send(`The user with the username ${name} was not found`)
    const { error } = validate(req.body)
    if(error) return res.status(401).send(error.details[0].message)
     
        user.name = req.body.name,
        user.username =  req.body.username,
        user.email =  req.body.email,
        user.password = req.body.password
       
   
    
    await user.save()
    res.send(user)

})

function validate (user) { 
    const schema = new Joi.object( {
        name: Joi.string().required().min(10).max(30),
        username: Joi.string().required().max(10).min(5),
        email: Joi.string().required().email(),
        password: new passwordComplexity(),
        isAdmin: Joi.boolean()
    })
    return schema.validate(user)
}


module.exports = router