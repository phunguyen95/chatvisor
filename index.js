var apiai = require('apiai');
const express = require('express');
const http = require('http');
const app = express();
const bodyParser = require('body-parser');
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
app.post('/api/submitMessage', (req, res) => {
  console.log(req.body);
  let bot = apiai('c621bac4072a4647bb9ecc2b2a0bad87');
  const message = req.body.message;
  var request = bot.textRequest(message, {
    sessionId: '123'
  });

  request.on('response', function(response) {
    res.json({
      message: response.result.fulfillment.messages[0].speech,
      single: message
    });
  });

  request.on('error', function(error) {
    console.log(error);
  });

  request.end();
});
