const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const http = require('http');
const cors = require('cors')
var security = require('./server/security')
var onboard = require('./server/onboard')
var seo = require('./server/seo')
var product = require('./server/product')
var logger = require('././server/config/log4j')
const app = express();
var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

app.use(cors(corsOptions))
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist')));

// app.use(function (req, res) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, HEAD');
// });
app.use((err, req, res, next) => {
  if (!err) {
    return next();
  }
  logger.error(req);
  logger.error(err);
  res.status(500);
  res.send('500: Internal server error');
});

app.use('/', security);
app.use('/', onboard);
app.use('/', seo);
app.use('/', product);
app.get('*'), (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
}
var port = process.env.PORT || '3000';
app.set('port', port);

var server = http.createServer(app);
server.listen(port, () => console.log('Server is running' + port));
