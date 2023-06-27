require('dotenv').config()
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User} = require('../models/User')
const middleware = require('../middleware/middleware')
const generateJWT = (id, username) => {
    return jwt.sign({id, username}, process.env.KEY, {
        expiresIn: process.env.TIME_KEY,
    })
}

class UserReg {
    async register(req, res) {
        const {username, password} = req.body
        if (!username || !password) return res.status(400)
        //check for unique
        if (await User.findOne({username})) {
            return res.status(400).json({code: 2, message: 'user has created'})
        }
        //crypt pass
        const hashPassword = bcrypt.hashSync(password, 3)

        //create user
        const user = new User({
            username: username,
            password: hashPassword,
        })
        await user.save()

        const token = generateJWT(user.id, user.username)

        return res
            .status(200)
            .json({token, code: 0, message: 'User has created'})
    }
    async login(req, res) {
        const {username, password} = req.body
        if (!username || !password) return res.status(400)
        //find user
        const user = await User.findOne({username})
        if (!user) {
            return res
                .status(400)
                .json({code: 1, message: `${username} has not created`})
        }
        //pass check
        const passCheck = bcrypt.compareSync(password, user.password)
        if (!passCheck)
            return res.status(400).json({code: 5, message: `wrong password`})

        const token = generateJWT(user.id, user.username)
        return res.status(200).json({code: 0, token})
    }
    async getUser(req, res) {
        const user = await User.findOne({username: req.user.username})
        return res.status(200).json({username: user.username})
    }
}
const controller = new UserReg()

const router = express.Router()
router.post('/register', controller.register)
router.post('/login', controller.login)

router.get('/getUser', middleware, controller.getUser)
module.exports = router
