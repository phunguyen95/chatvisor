let apiai = require('apiai');
const mongoose = require('mongoose');

const { Courses } = require('../model/Course');
handleInputUnknow=(response)=>{
  console.log(response);
  console.log(response.result.contexts[0]);
  if(response.result.action==='input.unknown' && response.result.contexts.length>0 && response.result.contexts[0].name==='awaiting_major'){
    return true;
  }
  else{
    return false;
  }
}
handleInputUnknowGreetings=(response)=>{
if(response.result.action==='input.unknown'){
  console.log('vo day');
  return true;
}
else{
  return false;
}
}
exports.processRequest = (req, res) => {
  console.log(req.body);
  let bot = apiai('c621bac4072a4647bb9ecc2b2a0bad87');

  const message = req.body.message;
  let request = bot.textRequest(message, {
    sessionId: '123'
  });
  request.on('response', async response => {
    let singleMajor;
    if(handleInputUnknow(response)){
      res.json({
        message:'Please provide your major',
        userSent:message
      })
    }
    if(handleInputUnknowGreetings(response)){
      res.json({
        message:'Please start the conversation by saying greetings phrases',
        userSent:message
      })
    }
    if (
      response.result.parameters.action &&
      response.result.contexts[0].parameters.givenMajor
    ) {
      let actionGiven;
      if (response.result.parameters.action.length > 0) {
        actionGiven = response.result.parameters.action[1];
        let majorGiven = response.result.contexts[0].parameters.givenMajor;
        console.log(actionGiven);
        if (actionGiven === 'elective') {
          const listOfElectivePapers = await Courses.find({})
            .where('nameOfMajor')
            .equals(majorGiven)
            .exec();
          listOfElectivePapers.forEach(data => {
            singleMajor = data;
          });
          res.json({
            message: response.result.fulfillment.messages[0].speech,
            userSent: message,
            singleMajor,
            actionGiven
          });
        } else if (actionGiven === 'prerequisites') {
          let paperGiven = response.result.parameters.papers;
          console.log(response);
          const listOfPrePaper = await Courses.find({})
            .where('corePapers.name')
            .equals(response.result.parameters.papers)
            .exec();
          if (listOfPrePaper.length > 0) {
            listOfPrePaper.forEach(data => {
              singleMajor = data;
            });

            res.json({
              message: response.result.fulfillment.messages[0].speech,
              userSent: message,
              singleMajor,
              paperGiven,
              actionGiven
            });
          } else {
            res.json({
              message: `Sorry, there is no ${paperGiven} in ${majorGiven}, please double check again`,
              userSent: message
            });
          }
        }
      }
      actionGiven = response.result.parameters.action[0];
      let majorGiven = response.result.contexts[0].parameters.givenMajor;
      console.log(actionGiven);
      if (actionGiven === 'elective') {
        const listOfElectivePapers = await Courses.find({})
          .where('nameOfMajor')
          .equals(majorGiven)
          .exec();
        listOfElectivePapers.forEach(data => {
          singleMajor = data;
        });
        res.json({
          message: response.result.fulfillment.messages[0].speech,
          userSent: message,
          singleMajor,
          actionGiven
        });
      } else if (actionGiven === 'prerequisites') {
        let paperGiven = response.result.parameters.papers;
        const listOfPrePaper = await Courses.find({})
          .where('corePapers.name')
          .equals(response.result.parameters.papers)
          .exec();
        if (listOfPrePaper.length > 0) {
          listOfPrePaper.forEach(data => {
            singleMajor = data;
          });

          res.json({
            message: response.result.fulfillment.messages[0].speech,
            userSent: message,
            singleMajor,
            paperGiven,
            actionGiven
          });
        } else {
          res.json({
            message: `Sorry, there is no ${paperGiven} in ${majorGiven}, please double check again`,
            userSent: message
          });
        }
      }
    } else if (response.result.action === 'given_major') {
      response.result.fulfillment.messages[0].speech = `So your major is ${
        response.result.parameters.givenMajor
      }`;
      res.json({
        message: response.result.fulfillment.messages[0].speech,
        userSent: message
      });
    } else {
      res.json({
        message: response.result.fulfillment.messages[0].speech,
        userSent: message
      });
    }
  });

  request.on('error', function(error) {
    console.log(error);
  });

  request.end();
};
