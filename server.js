//importing modules
const express = require('express')
const cookieParser = require('cookie-parser')
const db = require('./models')
const userRoutes = require ('./routes/userRoutes')
const ip = require('ip');
const host = ip.address();

//setting up your port
const port = process.env.PORT || 3000

//assigning the variable app to express
const app = express()

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true  }))
app.use(cookieParser())

// model.sync(options): https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization
// User.sync() - This creates the table if it doesn't exist (and does nothing if it already exists)
db.sequelize.sync().then(() => {
  console.log("db has been re sync")
})

app.get('/', function (req, res) {
  res.send('Node.js, Express, and Postgres API App running')
});
app.use('/api/users', userRoutes)

//listening to server connection
app.listen(port, function (error) {
  if (error) console.log("Error in server setup");
  console.log(`Server is listening on http://${host}:${port}`);
})
