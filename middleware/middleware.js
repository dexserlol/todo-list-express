const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            res.status(400).json({code: 6, message: 'user not found'})
        }
        const docodedData = jwt.verify(token, process.env.KEY)
        req.user = docodedData
        next()
    } catch {
        res.status(401).json({code: 1, message: 'not auth'})
    }
}
