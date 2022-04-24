const express = require('express')
module.exports = function ( req ,res , next) {
  const user = req.user
  
    if( user.isAdmin === false) return res.status(501).send("Acess denied User not authorized")
    next()

}