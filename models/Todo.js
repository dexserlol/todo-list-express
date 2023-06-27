const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    ListId: {type: String, required: true},
    AuthorId: {type: String, required: true},
    content: {type: String, required: true},
    active: {type: Boolean, required: true},
})
const Todo = mongoose.model('Todo', todoSchema)

module.exports = {Todo}
