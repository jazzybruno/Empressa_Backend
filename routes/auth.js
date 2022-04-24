const { application } = require('express')
const express = require('express')
const Joi = require('joi')
const passwordComplexity = require('joi-password-complexity')
const router = express.Router()
const User  = require('../models/user')
const bcryptjs = require('bcryptjs')


router.post('/' , async(req , res)=>{
    const { error } =  validate(req.body)
    if(error) return res.send(error.details[0].message)
    let user = await User.findOne({ email: req.body.email })
    if(!user) return res.send("the email or password is invalid")
    let valid =  await bcryptjs.compare(req.body.password , user.password)
    if(!valid) return res.send("the email or password is invalid")
    const token = user.genAuthToken()
    res.header('x-auth-token' , token).send(valid)
})

function validate(user) {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: new passwordComplexity()
    })
    return schema.validate(user)
}

module.exports = router