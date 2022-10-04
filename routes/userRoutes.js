//importing modules
const express = require('express')
const userController = require('../controllers/userController')
const { signup, login, getUser } = userController
const userAuth = require('../middlewares/userAuth')

const router = express.Router()

//signup endpoint
//passing the middleware function to the signup
router.post('/signup', userAuth.saveUser, signup)

//login route
router.post('/login', login)

router.get('/', getUser)

module.exports = router