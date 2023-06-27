require('dotenv').config()
const express = require('express')
const {Todo} = require('../models/Todo')
const middleware = require('../middleware/middleware')
const mongoose = require('mongoose')

class TodoList {
    async AddTodo(req, res) {
        const {id, content, active} = req.body
        if (!id || !content) return res.status(400)
        const todo = new Todo({
            ListId: id,
            content: content,
            active: active,
            AuthorId: req.user.id,
        })
        await todo.save()
        res.status(200).json({code: 0, message: 'list add'})
    }
    async GetTodo(req, res) {
        const {id} = req.body
        if (!id) return res.status(400)
        const list = await Todo.find({
            ListId: id,
            AuthorId: req.user.id,
        })

        if (!list) {
            return res.status(400).json({code: 2, message: 'not found'})
        }
        return res.status(200).json(list)
    }
    async TodoActive(req, res) {
        const {id} = req.body
        if (!id) return res.status(400)
        const todo = await Todo.findOne({
            _id: mongoose.Types.ObjectId(id),
            AuthorId: req.user.id,
        })
        if (!todo) {
            return res.status(400).json({code: 2, message: 'not found'})
        }
        await Todo.updateOne(
            {
                _id: id,
                AuthorId: req.user.id,
            },
            {
                active: !todo.active,
            }
        )
        return res.status(200).json({code: 0, message: 'change'})
    }
    async RemoveTodo(req, res) {
        const {id} = req.body
        if (!id) return res.status(400)
        await Todo.findOneAndDelete({
            _id: mongoose.Types.ObjectId(id),
            AuthorId: req.user.id,
        })
        return res.status(200).json({code: 0, message: 'deleted'})
    }
}

const controller = new TodoList()

const router = express.Router()
router.post('/addTodo', middleware, controller.AddTodo)
router.post('/TodoActive', middleware, controller.TodoActive)
router.post('/TodoRemove', middleware, controller.RemoveTodo)

router.post('/getTodo', middleware, controller.GetTodo)

module.exports = router
