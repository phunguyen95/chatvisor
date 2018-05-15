let apiai = require('apiai');
const mongoose = require('mongoose');
const isEmpty = require('../utils/isEmpty');

const  Courses  = require('../model/Course');
let lifespanMajor=10;
let lifeSpanAction=10;
let userMajor;
handleInputUnknowMajor=(response)=>{
  if(response.result.action==='input.unknown' && response.result.contexts.length>0 && response.result.contexts[0].name==='awaiting_major' && lifespanMajor>0 ||response.result.action==='input.unknown' && lifespanMajor>0&&response.result.contexts.length>0 && response.result.contexts[0].name==='awaiting_major' && (isEmpty(response.result.contexts[0].action  )) ){
    lifespanMajor--;
    return true;
  }
  else{
    return false;
  }
}
handleInputUnKnow=(response)=>{
  if(response.result.action==='input.unknown' && response.result.contexts.length>0){
    lifespanMajor=0;
    return true;
  }
}
handleInputUnknowGreetings=(response)=>{
if(response.result.action==='input.unknown' &&isEmpty(response.result.contexts)){
  return true;
}
else{
  return false;
}
}
exports.processRequest = (req, res) => {
  let bot = apiai('c621bac4072a4647bb9ecc2b2a0bad87');

  const message = req.body.message;
  let request = bot.textRequest(message, {
    sessionId: '123'
  });
  request.on('response', async response => {
    let singleMajor;
    if(handleInputUnknowMajor(response)){
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
    if(handleInputUnKnow(response)){
      res.json({
        message:'Sorry I dont understand',
        userSent:message
      })
    }
    if (!isEmpty(userMajor) && lifeSpanAction > 0 && !isEmpty(response.result.parameters))
    {
      let actionGiven;
        console.log(response);
        if (response.result.parameters.action.length > 0) {
          actionGiven = response.result.parameters.action[0];
          if (actionGiven === 'elective') {
            const listOfElectivePapers = await Courses.find({})
              .where('nameOfMajor')
              .equals(userMajor)
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
            let result = Courses.find({});
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
                message: `Sorry, there is no ${paperGiven} in ${userMajor}, please double check again`,
                userSent: message
              });
            }
          }
        
      }
      
    }
    else if (response.result.action === 'given_major') {
      console.log('vo day');
     lifespanMajor=0;
     userMajor=response.result.parameters.givenMajor;
     response.result.fulfillment.messages[0].speech = `So your major is ${
       response.result.parameters.givenMajor
     }`; 
     res.json({
       message: response.result.fulfillment.messages[0].speech,
       userSent: message
     });
   }
      else if(isEmpty(response.result.parameters)) {
      res.json({
        message: response.result.fulfillment.messages[0].speech,
        userSent: message
      });
    }
  });

  request.on('error', function(error) {
  });

  request.end();
};
