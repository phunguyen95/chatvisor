const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const db = require('./config/keys').mongoURI;
const Courses = require( './model/Course');
const bodyParser = require('body-parser');
const messageController = require('./controllers/index');
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
app.post('/api/sampleDatabase',(req,res)=>{
  let newCourse = new Courses({
    text:'abc',
  });
  newCourse.save().then(course=>res.status(200).json(course));

})