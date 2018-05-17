let apiai = require('apiai');
const mongoose = require('mongoose');
const isEmpty = require('../utils/isEmpty');
const Courses = require('../model/Course');
let lifespanMajor = 10;
let lifeSpanAction = 10;
let majorGiven;
let actionGiven;
let startConvo = false;
//  handleInputUnknowMajor=(response)=>{
//   if(response.result.action==='input.unknown' && response.result.contexts.length>0 && response.result.contexts[0].name==='awaiting_major' && lifespanMajor>0 ||response.result.action==='input.unknown' && lifespanMajor>0 &&response.result.contexts.length>0 && response.result.contexts[0].name==='awaiting_major' && (isEmpty(response.result.contexts[0].action  )) ){
//     lifespanMajor--;
//     return true;
//   }
//   else{
//     return false;
//   }
// }
handleInputUnKnow = response => {
  if (
    response.result.action === 'input.unknown' &&
    !isEmpty(majorGiven) &&
    startConvo === true
  ) {
    lifespanMajor = 0;
    return true;
  }
};

handleInputUnknowGreetings = response => {
  if (isEmpty(response.result.action) && !startConvo) {
    return true;
  } else {
    return false;
  }
};
exports.initializeSocket = socketIo => {};

exports.processRequest = (req, res) => {
  let bot = apiai('c621bac4072a4647bb9ecc2b2a0bad87');
  console.log(bot);
  const message = req.body.message;
  let request = bot.textRequest(message, {
    sessionId: '123'
  });
  request.on('response', async response => {
    let foundResults;
    console.log(response);
    // if(handleInputUnknowMajor(response)){
    //   res.json({
    //     message:'Please provide your major',
    //     userSent:message
    //   })
    // }
    if (handleInputUnknowGreetings(response)) {
      res.json({
        message: 'Please start the conversation by saying greetings phrases',
        userSent: message
      });
    }
    if (handleInputUnKnow(response)) {
      res.json({
        message: 'Sorry I dont understand',
        userSent: message
      });
    }

    if (!isEmpty(response.result.parameters)) {
      if (!isEmpty(response.result.parameters.action)) {
        actionGiven = response.result.parameters.action[0];
        majorGiven = response.result.parameters.major;
        if (actionGiven === 'elective') {
          const listOfElectivePapers = await Courses.find({})
            .where('nameOfMajor')
            .equals(majorGiven)
            .exec();
          listOfElectivePapers.forEach(data => {
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
          const listOfPrePaper = await Courses.find({});
          let corePapers;
          let electivePapers;   
          let results;         
          listOfPrePaper.map(list=>{
           let query= list.corePapers.filter(item=>item.name===paperGiven);
             if (query.length > 0) {              
              corePapers=query;
          }
        })
          if(!isEmpty(corePapers)){
            foundResults= corePapers;
            res.json({
              message: response.result.fulfillment.messages[0].speech,
              userSent: message,
              foundResults,
              actionGiven,
              paperGiven
            })
          } 
          else
          {
            listOfPrePaper.map(list=>{
                  let query= list.electivePapers.filter(item=>item.name===paperGiven);
                  if(query.length>0){
                    electivePapers=query;
                  }
               })
               if(!isEmpty(electivePapers)){
                  foundResults= electivePapers;
                  res.json({
                    message: response.result.fulfillment.messages[0].speech,
                    userSent: message,
                    foundResults,
                    actionGiven,
                    paperGiven
                  })
               }
               else {
                res.json({
                  message: `Sorry, there is no  papers named ${paperGiven}, please double check again`,
                  userSent: message
                });
              }
          }
           
        } else if (actionGiven === 'corequisites') {
          let paperGiven = response.result.parameters.papers;
          const listOfPrePaper = await Courses.find({});
          let corePapers;
          let electivePapers;   
          let results;         
          listOfPrePaper.map(list=>{
           let query= list.corePapers.filter(item=>item.name===paperGiven);
             if (query.length > 0) {              
              corePapers=query;
          }
        })
          if(!isEmpty(corePapers)){
            foundResults= corePapers;
            res.json({
              message: response.result.fulfillment.messages[0].speech,
              userSent: message,
              foundResults,
              actionGiven,
              paperGiven
            })
          } 
          else
          {
            listOfPrePaper.map(list=>{
                  let query= list.electivePapers.filter(item=>item.name===paperGiven);
                  if(query.length>0){
                    electivePapers=query;
                  }
               })
               if(!isEmpty(electivePapers)){
                  foundResults= electivePapers;
                  res.json({
                    message: response.result.fulfillment.messages[0].speech,
                    userSent: message,
                    foundResults,
                    actionGiven,
                    paperGiven
                  })
               }
               else {
                res.json({
                  message: `Sorry, there is no  papers named ${paperGiven}, please double check again`,
                  userSent: message
                });
              }
          }
        }
         else if (actionGiven === 'suggested') {
          majorGiven = response.result.parameters.major;
          startConvo=true;
          res.json({
            message: 'Which years are you in',
            userSent: message
          });
        }
      } else if (!isEmpty(response.result.parameters.year)) {
        const currentYear = response.result.parameters.year;
        if (parseInt(currentYear) < 4) {
          paperGiven = '';
          const lists = await Courses.find({ nameOfMajor: majorGiven });
          let corePapers;
          lists.map(list => {
            corePapers = list.corePapers.filter(
              item => item.year.toString() === currentYear
            );
          });
          let electivePapers;
          lists.map(list => {
            electivePapers = list.electivePapers.filter(
              item => item.year.toString() === currentYear
            );
          });
          let foundResults;
          foundResults = [...corePapers, ...electivePapers];
          res.json({
            message: response.result.fulfillment.messages[0].speech,
            userSent: message,
            foundResults,
            actionGiven,
            paperGiven
          });
        } else {
          res.json({
            message:
              'We cant find any papers related to your study,can you please re-enter the year again',
            userSent: message
          });
        }
      } else if (
        !isEmpty(response.result.parameters.major) &&
        !isEmpty(response.result.parameters.papers)
      ) {
        actionGiven = 'following';
        majorGiven = response.result.parameters.major;
        paperGiven=response.result.parameters.papers
        const listPapers = await Courses.find({ nameOfMajor: majorGiven });
        let foundResults;
        listPapers.map(item => {
          foundResults = item.corePapers.filter(
            item => item.name === paperGiven
          );
        });
        if (foundResults.length > 0) {
          res.json({
            message: response.result.fulfillment.messages[0].speech,
            userSent: message,
            foundResults,
            actionGiven,
            paperGiven
          });
        } else {
          listPapers.map(item => {
            foundResults = item.electivePapers.filter(
              item => item.name === paperGiven
            );
          });
          if (foundResults.length > 0) {
            res.json({
              message: response.result.fulfillment.messages[0].speech,
              userSent: message,
              foundResults,
              actionGiven,
              paperGiven
            });
          }
        }
      } else if (
        isEmpty(response.result.parameters.major) ||
        isEmpty(response.result.parameters.papers)
      ) {
        res.json({
          message: 'Please enter correct papers or major',
          userSent: message
        });
      }
      // else if(!isEmpty(response.result.parameters.careers)){
      //   let careerGiven = response.result.parameters.careers;
      //   let results = await Course.find({})
      //   .where('careerOppourtunities.name')
      //   .equals(careerGiven)
      //   .exec();

      // }
    } else if (isEmpty(response.result.parameters)) {
      startConvo = true;
      res.json({
        message: response.result.fulfillment.messages[0].speech,
        userSent: message
      });
    }
  });

  request.on('error', function(error) {});

  request.end();
};

