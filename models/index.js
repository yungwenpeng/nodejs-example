//importing modules
require('dotenv').config();

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_DAILECT, DB_PORT } = process.env;
const { Sequelize, DataTypes } = require('sequelize')

//Database connection with dialect of postgres specifying the database we are using
//port for my database is 5433
//database name is discover
const sequelize = new Sequelize({
    host: DB_HOST,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    dialect: DB_DAILECT,
    port: DB_PORT
})

//checking if connection is done
sequelize.authenticate().then(() => {
    console.log(`Connection has been established successfully.`)
}).catch((err) => {
    console.log('Unable to connect to the database:', err)
})

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

//connecting to model
db.users = require('./userModel') (sequelize, DataTypes)

//exporting the module
module.exports = db