const jwt = require('jsonwebtoken')
module.exports = function ( req , res , next) {
    token = req.header('x-auth-token')
   if(!token) return res.status(401).send('Acess denied ! No token provided')
   
   try {
    const valid = jwt.verify(token , 'Bruno@1980')
       req.user = valid
       next()
   } catch (error) {
    res.status(401).send('Acess denied ! Invalid token')
   }

}

