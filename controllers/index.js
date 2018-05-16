let apiai = require('apiai');
const mongoose = require('mongoose');
const isEmpty = require('../utils/isEmpty');
const  Courses  = require('../model/Course');
let lifespanMajor=10;
let lifeSpanAction=10;
let majorGiven;
let actionGiven;
let io  = global.io
let startConvo = false;
io.sockets.on('connection', function(socket){
  console.log(socket.id);
  console.log('client connected')
})

//  handleInputUnknowMajor=(response)=>{
//   if(response.result.action==='input.unknown' && response.result.contexts.length>0 && response.result.contexts[0].name==='awaiting_major' && lifespanMajor>0 ||response.result.action==='input.unknown' && lifespanMajor>0 &&response.result.contexts.length>0 && response.result.contexts[0].name==='awaiting_major' && (isEmpty(response.result.contexts[0].action  )) ){
//     lifespanMajor--;
//     return true;
//   }
//   else{
//     return false;
//   }
// }
handleInputUnKnow=(response)=>{
  if(response.result.action==='input.unknown' && !isEmpty(majorGiven) ){
    lifespanMajor=0;
    return true;
  }
}
handleInputUnknowGreetings=(response)=>{
if(response.result.action==='input.unknown' && !startConvo){
  return true;
}
else{
  return false;
}
}
exports.initializeSocket=(socketIo)=>{

}

exports.processRequest = (req, res) => {
  let bot = apiai('c621bac4072a4647bb9ecc2b2a0bad87');
  console.log('asd');
  const message = req.body.message;
  let request = bot.textRequest(message, {
    sessionId: '123'
  });
  request.on('response', async response => {
    let foundResults;
    // if(handleInputUnknowMajor(response)){
    //   res.json({
    //     message:'Please provide your major',
    //     userSent:message
    //   })
    // }
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

      
      if(!isEmpty(response.result.parameters)){
        console.log(response);
        if (!isEmpty(response.result.parameters.action)) {
          actionGiven = response.result.parameters.action[0];
           majorGiven = response.result.parameters.papers;
          if (actionGiven === 'elective') {
            const listOfElectivePapers = await Courses.find({})
              .where('nameOfMajor')
              .equals(majorGiven)
              .exec();
            listOfElectivePapers.forEach(data => {
              console.log(data)
              foundResults = data;
            });
            res.json({
              message: response.result.fulfillment.messages[0].speech,
              userSent: message,
              foundResults,
              actionGiven
            });
          } else if (actionGiven === 'prerequisites') {
            let paperGiven = response.result.parameters.papers;
            const listOfPrePaper = await Courses.find({"corePapers.name":paperGiven})
            if (listOfPrePaper.length > 0) {
              listOfPrePaper.forEach(data => {
                foundResults = data;
              });
              res.json({
                message: response.result.fulfillment.messages[0].speech,
                userSent: message,
                foundResults,
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
        // else if(!isEmpty(response.result.parameters.careers)){
        //   let careerGiven = response.result.parameters.careers;
        //   let results = await Course.find({})
        //   .where('careerOppourtunities.name')
        //   .equals(careerGiven)
        //   .exec();
          
        // }

      }
      
    

      else if(isEmpty(response.result.parameters)) {
        startConvo=true;
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
