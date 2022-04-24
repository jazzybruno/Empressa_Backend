const express =  require('express')
const app = express()
const PORT = 2000;
const database = require('./startups/mongodb')
const user = require('./routes/user')
const auth = require('./routes/auth')
const books = require('./routes/book')
const borrow = require('./routes/borrowers')

database()
app.use(express.json())
app.use('/api/user' , user)
app.use('/api/auth' , auth)
app.use('/api/books' , books)
app.use('/api/borrow' , borrow)

app.listen(PORT , ()=>{
    console.log(`The server is connected on port ${PORT}`);
})