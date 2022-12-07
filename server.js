//importing modules
const express = require('express')
const { createServer } = require("http");
const WebSocket = require('ws');
const cookieParser = require('cookie-parser')
const db = require('./models')
const userRoutes = require ('./routes/userRoutes')
const ip = require('ip');
const host = ip.address();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const fs = require('fs')
var options = {
  customCss: fs.readFileSync(("./swagger.css"), 'utf8')
};

//setting up your port
const port = process.env.PORT || 3000

//assigning the variable app to express
const app = express()

//middleware
app.use(express.json())
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// model.sync(options): https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization
// User.sync() - This creates the table if it doesn't exist (and does nothing if it already exists)
db.sequelize.sync().then(() => {
  console.log("db has been re sync")
})
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, x-access-token, Origin, Content-Type, Accept"
  );
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use('/api', userRoutes)
const server = createServer(app);
//listening to server connection
server.listen(port, function (error) {
  if (error) console.log("Error in server setup");
  console.log(`Server is listening on http://${host}:${port}`);
})

app.on('close', function(){
  db.sequelize.close();
})


const socketServer = new WebSocket.Server({server});
socketServer.on('connection', (socketClient, req) => {
  //https://stackoverflow.com/questions/22429744/how-to-setup-route-for-websocket-server-in-express
  app.locals.clients = socketServer.clients;
  //console.log('[SERVER] app.locals.client:', app.locals.clients);
  //get the IP address of the client
  const ip = req.socket.remoteAddress;
  console.log('[SERVER] connected - Ip:', ip);
  console.log('[SERVER] client Set length: ', socketServer.clients.size);
  socketClient.on('message', (data) => {
    // data: from client's message
    // A client WebSocket broadcasting to all connected WebSocket clients
    console.log('[SERVER] data: ', JSON.stringify([data]));
    socketServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify([data]), (err) => {
          if(err){
            console.log(`[SERVER] error:${err}`);
          }
        });
      }
    });
  });
  socketClient.on('close', (socketClient) => {
    console.log('[SERVER] Close connected');
    console.log('[SERVER] Number of clients: ', socketServer.clients.size);
  });
});