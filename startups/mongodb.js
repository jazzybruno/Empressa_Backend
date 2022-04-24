const mongoose =  require('mongoose')
const URL = "mongodb://localhost/E-study"

module.exports = function () {
    mongoose.connect(URL , (err) => {
        if (err) {
            console.log(err);
        }
        if (!err) {
            console.log("The database is connected successfully");
        }
    })
}