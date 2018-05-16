const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const db = require('./config/keys').mongoURI;
const Courses = require( './model/Course');
const bodyParser = require('body-parser');
const socketIO = require('socket.io')

const app = express();
const server = http.createServer(app)
global.io = socketIO(server)
const messageController = require('./controllers/index');
messageController.initializeSocket(io);

dotenv.config();
const Promise = require('bluebird');

mongoose.Promise = Promise;
mongoose
.connect(db)
.then(() => {
  console.log(db);
  console.log('connected');
})
.catch(err => {
  console.log(err);
});

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
server.listen(port, () => {
  console.log(`App is running on port,${port}`);
});
app.get('/api/homepage', (req, res) => {
 
});

app.post('/api/submitMessage', messageController.processRequest);
