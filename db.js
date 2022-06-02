const mongoose = require("mongoose");

var mongoURL = "mongodb+srv://sangeer:sangeer@cluster0.aiap8.mongodb.net/mern-rooms"

mongoose.connect(mongoURL , {useUnifiedTopology : true , useNewUrlParser:true})

var connection = mongoose.connection

connection.on('error' , ()=>{
        console.log('Mongo DB Connection failed')
})

// var connection = mongoose.connection

connection.on('connected' , ()=>{
        console.log('Mongo DB Connection successful!')
})

module.exports = mongoose