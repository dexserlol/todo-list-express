const mongoose = require('mongoose')

const listSchema = new mongoose.Schema({
    AuthorId: {type: String, required: true},
    listName: {type: String, required: true},
})
const List = mongoose.model('List', listSchema)

module.exports = {List}
