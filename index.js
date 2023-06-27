require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const AccoutRoute = require('./route/user')
const ListRoute = require('./route/lists')
const TodoRoute = require('./route/todo')

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/user', AccoutRoute)
app.use('/lists', ListRoute)
app.use('/todo', TodoRoute)
app.get('/', (req, res) => {
    console.log(1)
    res.json('test')
})
app.listen(process.env.PORT || process.env.SERVER_PORT, async () => {
    mongoose.connect(process.env.MONGODB_URL)
    console.log(
        `Server started on port http://192.168.0.100:${process.env.SERVER_PORT}`
    )
})
