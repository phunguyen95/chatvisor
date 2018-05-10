const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const bodyParser = require('body-parser');
const messageController = require('./controllers/index');
dotenv.config();
const Promise = require('bluebird');

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URL, {
  useMongoClient: true
});
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

if (['production'].includes(process.env.NODE_ENV)) {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'));
  });
}
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`SERVER RUNNNING`, port);
});
app.get('/api/homepage', (req, res) => {});
app.post('/api/submitMessage', messageController.processRequest);
