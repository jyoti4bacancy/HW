const express = require('express')
const jwt = require("jsonwebtoken");
require('dotenv').config()
const app = express()
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose')
app.use(express.json())
const router=require('./router/user')

mongoose.connect(process.env.MongoDB_url,
    {
        useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,
        useFindAndModify: false
    })

app.use(router)

app.listen(PORT, () => {
    console.log("app listening on " + PORT)
})