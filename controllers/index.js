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

// handleInputUnknowGreetings = response => {
//   if (
//     isEmpty(response.result.action.parameters) &&
//     (startConvo === false && isEmpty(response.result.action))
//   ) {
//     return true;
//   } else {
//     return false;
//   }
// };

exports.processRequest = (req, res) => {
  let bot = apiai('ef35e9af544f49eca390aaf90467c240');
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
    // if (handleInputUnknowGreetings(response)) {
    //   res.json({
    //     message: 'Please start the conversation by saying greetings phrases',
    //     userSent: message
    //   });
    // }
    if (handleInputUnKnow(response)) {
      res.json({
        message:
          'Sorry! I do not quite understand you. Could you try another question?',
        userSent: message
      });
    }

    if (!isEmpty(response.result.parameters)) {
      if (!isEmpty(response.result.parameters.action)) {
        actionGiven = response.result.parameters.action;
        majorGiven = response.result.parameters.major;
        let jobGiven = response.result.parameters.jobTitle
          ? response.result.parameters.jobTitle
          : null;
        if (actionGiven === 'elective') {
          const listOfElectivePapers = await Courses.find({})
            .where('nameOfMajor')
            .equals(majorGiven)
            .exec();
          listOfElectivePapers.forEach(data => {
            foundResults = data;
          });
          
          if(listOfElectivePapers.length>0){
            res.json({
              message: response.result.fulfillment.messages[0].speech,
              userSent: message,
              foundResults,
              actionGiven,
              majorGiven
            });
          }
          else{
            res.json({
              message:'Sorry, we can not find any results regarding on that major',
              userSent:message
            })
          }
         
        } else if (actionGiven === 'prerequisites') {
          let paperGiven = response.result.parameters.papers;
          const listOfPrePaper = await Courses.find({});
          let corePapers;
          let electivePapers;
          let results;
          listOfPrePaper.map(list => {
            let query = list.corePapers.filter(
              item => item.name === paperGiven
            );
            if (query.length > 0) {
              corePapers = query;
            }
          });
          if (!isEmpty(corePapers)) {
            foundResults = corePapers;
            res.json({
              message: response.result.fulfillment.messages[0].speech,
              userSent: message,
              foundResults,
              actionGiven,
              paperGiven
            });
          } else {
            listOfPrePaper.map(list => {
              let query = list.electivePapers.filter(
                item => item.name === paperGiven
              );
              if (query.length > 0) {
                electivePapers = query;
              }
            });
            if (!isEmpty(electivePapers)) {
              foundResults = electivePapers;
              res.json({
                message: response.result.fulfillment.messages[0].speech,
                userSent: message,
                foundResults,
                actionGiven,
                paperGiven
              });
            } else {
              res.json({
                message: `Sorry, there are no papers named like that. Perhaps try again with another paper?`,
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
          listOfPrePaper.map(list => {
            let query = list.corePapers.filter(
              item => item.name === paperGiven
            );
            if (query.length > 0) {
              corePapers = query;
            }
          });
          if (!isEmpty(corePapers)) {
            foundResults = corePapers;
            res.json({
              message: response.result.fulfillment.messages[0].speech,
              userSent: message,
              foundResults,
              actionGiven,
              paperGiven
            });
          } else {
            listOfPrePaper.map(list => {
              let query = list.electivePapers.filter(
                item => item.name === paperGiven
              );
              if (query.length > 0) {
                electivePapers = query;
              }
            });
            if (!isEmpty(electivePapers)) {
              foundResults = electivePapers;
              res.json({
                message: response.result.fulfillment.messages[0].speech,
                userSent: message,
                foundResults,
                actionGiven,
                paperGiven
              });
            } else {
              res.json({
                message: `Sorry, there are no papers named like that. Perhaps try again with another paper?`,
                userSent: message
              });
            }
          }
        } else if (actionGiven === 'following') {
          paperGiven = response.result.parameters.papers;
          const listPapers = await Courses.find({});
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
            } else {
              res.json({
                message: `Sorry, there are no papers named like that. Perhaps try again with another paper?`,
                userSent: message
              });
            }
          }
        } else if (actionGiven === 'suggested' && isEmpty(jobGiven)) {
          majorGiven = response.result.parameters.major;
          startConvo = true;
          res.json({
            message: 'Which year of your degree are you currently in?',
            userSent: message
          });
        } else if (response.result.parameters.action === 'jobseeker') {
          const jobTitle = response.result.parameters.jobTitle
            ? response.result.parameters.jobTitle
            : null;
          let lists = await Courses.find({
            'careerOppotunities.name': jobTitle
          });
          let foundResults;
          lists.map(list => {
            foundResults = list.nameOfMajor;
          });
          if (!isEmpty(lists)) {
            res.json({
              message: `You shoud consider taking ${foundResults} if you want to be a ${jobTitle}`,
              userSent: message
            });
          } else {
            res.json({
              message: `Sorry, we couldnt find any suggested majors for that specific job`,
              userSent: message
            });
          }
        } else if (
          (isEmpty(response.result.parameters.major) && isEmpty(jobGiven)) ||
          (isEmpty(response.result.parameters.papers) && isEmpty(jobGiven))
        ) {
          res.json({
            message: 'Please enter correct papers or major',
            userSent: message
          });
        }
      } else if (!isEmpty(response.result.parameters.year)) {
        const currentYear = response.result.parameters.year;
        if (parseInt(currentYear) < 4) {
          paperGiven = '';
          const lists = await Courses.find({ nameOfMajor: majorGiven });
          let corePapers;
          let major;
          lists.map(list => {
            major = list.nameOfMajor;
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
            paperGiven,
            major,
            currentYear
          });
        } else {
          res.json({
            message:
              'Sorry the papers that are offered are limited to only year 1, 2 or 3. Can you please re-enter the year again?',
            userSent: message
          });
        }
      }
    } else if (isEmpty(response.result.parameters)) {
      startConvo = true;
      res.json({
        message: response.result.fulfillment.messages[0].speech,
        userSent: message
      });
    }
     if(isEmpty(response.result.parameters.jobTitle) && isEmpty(response.result.parameters.papers) && isEmpty(response.result.parameters.major)){
       console.log(response);
      res.json({
        message: `Sorry, we couldnt find any suggested majors for that specific job`,
        userSent: message          
      })
    }
    else if (!isEmpty(response.result.parameters.jobTitle)&& isEmpty(response.result.parameters.papers) && isEmpty(response.result.parameters.major)) {
      const jobTitle = response.result.parameters.jobTitle
        ? response.result.parameters.jobTitle
        : null;
      let lists = await Courses.find({
        'careerOppotunities.name': jobTitle
      });
      let foundResults;
      lists.map(list => {
        foundResults = list.nameOfMajor;
      });
      if (!isEmpty(lists)) {
        res.json({
          message: `You shoud consider taking ${foundResults} if you want to be a ${jobTitle}`,
          userSent: message
        });
      } else {
        console.log('vo else');
        res.json({
          message: `Sorry, we couldnt find any suggested majors for that specific job`,
          userSent: message
        });
      }
    }
    if(!isEmpty(response.result.parameters.papers)){
      res.json({
        message: `Sorry, what do you mean by ${response.result.parameters.papers}?`,
        userSent: message          
      })
    }
  
  });

  request.on('error', function(error) {});

  request.end();
};
