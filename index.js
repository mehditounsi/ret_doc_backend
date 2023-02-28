require('dotenv').config()

const express = require('express');
const winston = require('winston');

var morgan = require('morgan')
const responseTime = require('response-time')

let Ratelimiter = require("./helpers/limiter")

const app = express();

const http = require('http');

const httpPort = 3000;

const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require("helmet");

app.use(morgan('dev'))

app.use(cors());

app.use(express.static("public"))

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

app.use(bodyParser.json())
// app.use(Ratelimiter.limiter());
app.use(responseTime())
app.use(helmet())


require('./helpers/logging')();
require('./routes/retenue')(app);
require('./routes/admin')(app);


var httpServer = http.createServer(app)

httpServer.listen(httpPort, () => {
  console.log("Http server listing on port : " + httpPort)
});


// Gracefull shutdown

process.on('SIGTERM', gracefullShutDown);
process.on('SIGINT', gracefullShutDown);

function gracefullShutDown() {
  console.log('Received kill signal, shutting down gracefully');
  httpServer.close(() => {
    console.log('Closed out remaining connections');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);

}


module.exports = httpServer;