require('dotenv').config()
const express = require('express')
const {List} = require('../models/Lists')
const {Todo} = require('../models/Todo')
const middleware = require('../middleware/middleware')
const mongoose = require('mongoose')

class TodoList {
    async addList(req, res) {
        const {name} = req.body
        if (!name) return res.status(400)
        const list = new List({listName: name, AuthorId: req.user.id})
        await list.save()
        res.status(200).json({code: 0, message: 'list add'})
    }
    async getList(req, res) {
        const list = await List.find({
            AuthorId: req.user.id,
        })

        if (!list) {
            return res.status(400).json({code: 1, message: 'not found'})
        }
        return res.status(200).json(list)
    }
    async getListById(req, res) {
        const {id} = req.body
        if (!id) return res.status(400)
        const list = List.findOne({
            _id: mongoose.Types.ObjectId(id),
            AuthorId: req.user.id,
        })
        if (!list) {
            return res.status(400).json({code: 1, message: 'list not found'})
        }
        return res.status(200).json(list)
    }
    async removeList(req, res) {
        const {id} = req.body
        if (!id) return res.status(400)
        await List.findOneAndDelete({
            _id: mongoose.Types.ObjectId(id),
            AuthorId: req.user.id,
        })
        await Todo.deleteMany({
            ListId: mongoose.Types.ObjectId(id),
            AuthorId: req.user.id,
        })
        return res.status(200).json({code: 0, message: 'deleted'})
    }
}

const controller = new TodoList()

const router = express.Router()

router.post('/addList', middleware, controller.addList)
router.post('/removeList', middleware, controller.removeList)

router.get('/getList', middleware, controller.getList)
router.get('/findList', middleware, controller.getListById)

module.exports = router
