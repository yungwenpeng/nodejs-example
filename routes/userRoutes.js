//importing modules
const express = require('express')
const userController = require('../controllers/userController')
const { signup, login, getUser, updateUser, deleteUser } = userController
const userAuth = require('../middlewares/userAuth')

const router = express.Router()

//signup endpoint
//passing the middleware function to the signup
router.post('/users/signup', userAuth.saveUser, signup)

//login route
router.post('/login', login)

// users?query=
router.get('/users', getUser)
router.put('/users/:email', updateUser)
router.delete('/users/:email', deleteUser)

module.exports = router