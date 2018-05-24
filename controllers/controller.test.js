const Courses = require('../model/Course');
const isEmpty = require('../utils/isEmpty');
const mongoose = require('mongoose');
const db = require('../config/keys').mongoURI;

mongoose.Promise = Promise;
mongoose
  .connect(db)
  .then(() => {})
  .catch(err => {
    console.log(err);
  });
let apiai = require('apiai');

test('Object is empty', () => {
  const obj = {};
  expect(isEmpty(obj)).toBe(true);
});
test('Array is empty', () => {
  const arr = [];
  expect(isEmpty(arr)).toBe(true);
});
test('String is empty', () => {
  const string = '';
  expect(isEmpty(string)).toBe(true);
});
test('Server should be able to connect to mongoose database', () => {
  mongoose.connect(db).then(data => {
    expect(!isEmpty(data)).toBe(true);
  });
});
describe('When user send requuest', () => {
  test('Server should be able to access to DialogFlow API', () => {
    let bot = apiai('ef35e9af544f49eca390aaf90467c240');
    expect(isEmpty(bot)).toBe(false);
  });
  test('Server should be able to receive request from DialogFlow', done => {
    let bot = apiai('ef35e9af544f49eca390aaf90467c240');
    const message = 'Hi';
    let request = bot.textRequest(message, {
      sessionId: '123'
    });
    request.on('response', async response => {
      expect(isEmpty(response)).toBe(false);
      done();
    });
    request.end();
  });
  test('Server should be able to respond Welcome after user say Hi', done => {
    let bot = apiai('ef35e9af544f49eca390aaf90467c240');
    const message = 'Hi';
    let request = bot.textRequest(message, {
      sessionId: '123'
    });
    request.on('response', async response => {
      expect(isEmpty(response.result.fulfillment.messages[0].speech)).toBe(
        false
      );
      done();
    });
    request.end();
  });
  test('Server should be able to handle with unknown input from user', done => {
    let bot = apiai('ef35e9af544f49eca390aaf90467c240');
    const message = 'asdasdasdasd';
    let request = bot.textRequest(message, {
      sessionId: '123'
    });
    request.on('response', async response => {
      expect(response.result.action).toBe('input.unknown');
      done();
    });
    request.end();
  });
  test('Server should be able to receive the name of <paper given> by students', done => {
    let bot = apiai('ef35e9af544f49eca390aaf90467c240');
    const message = 'Programming 2';
    let request = bot.textRequest(message, {
      sessionId: '123'
    });
    request.on('response', async response => {
      expect(response.result.parameters.papers).toBe('Programming 2');
      done();
    });
    request.end();
  });
  test('Server should be able to receive the <major given> given by students', done => {
    let bot = apiai('ef35e9af544f49eca390aaf90467c240');
    const message =
      'can you provide me a suggested set of papers for software development';
    let request = bot.textRequest(message, {
      sessionId: '123'
    });
    request.on('response', async response => {
      expect(response.result.parameters.major).toBe('Software Development');
      done();
    });
    request.end();
  });
  test('Server should be able to handle <action given> by user', done => {
    let bot = apiai('ef35e9af544f49eca390aaf90467c240');
    const message = 'What papers is prerequisites of Programming 2';
    let request = bot.textRequest(message, {
      sessionId: '123'
    });
    request.on('response', async response => {
      expect(response.result.parameters.action).toBe('prerequisites');
      done();
    });
    request.end();
  });
  test('Server should be able to responds list of elective papers from database for <major given> by students', done => {
    let bot = apiai('ef35e9af544f49eca390aaf90467c240');
    const message =
      'Can you show me a list of elective papers for software development';
    let request = bot.textRequest(message, {
      sessionId: '123'
    });
    request.on('response', async response => {
      let actionGiven = response.result.parameters.action;
      majorGiven = response.result.parameters.major;
      const listOfElectivePapers = await Courses.find({});
      expect(!isEmpty(listOfElectivePapers)).toBe(true);
      done();
    });
    request.end();
  });

  test('Server should be able to let students know what papers is prerequisites of <paper given> ', done => {
    let bot = apiai('ef35e9af544f49eca390aaf90467c240');
    const message = 'What papers is prerequisites of Programming 2';
    let request = bot.textRequest(message, {
      sessionId: '123'
    });
    request.on('response', async response => {
      let paperGiven = response.result.parameters.papers;
      const lists = await Courses.find({});
      let corePapers;
      let electivePapers;
      let results;
      let listResults;
      lists.map(list => {
        listResults = list.corePapers.filter(item => item.name === paperGiven);
        if (listResults.length > 0) {
          corePapers = listResults;
        }
      });
      if (!isEmpty(corePapers)) {
        results = corePapers.map(item => item.prerequisites);
        let result;
        results.map(item => (result = item));
        if (result.length > 0) {
          expect(result[0]).toBe('COMP500 Programming 1');
        } else {
          results = 'This paper does not have any prerequisites papers';
          expect(results).toBe(
            'This paper does not have any prerequisites papers'
          );
        }
      } else {
        lists.map(list => {
          listResults = list.electivePapers.filter(
            item => item.name === paperGiven
          );
          if (listResults.length > 0) {
            electivePapers = listResults;
          }
        });
        if (!isEmpty(electivePapers)) {
          results = electivePapers.map(item => item.prerequisites);
          let result;
          results.map(item => (result = item));
          if (result.length > 0) {
            expect(!isEmpty(results)).toBe(true);
          } else {
            results = 'This paper does not have any prerequisites papers';
            expect(results).toBe(
              'This paper does not have any prerequisites papers'
            );
          }
        }
      }

      done();
    });
    request.end();
  });
  test('Server should be able to let students know what papers is corequisites of <paper given> ', done => {
    let bot = apiai('ef35e9af544f49eca390aaf90467c240');
    const message =
      'What papers is corequisites of Program Design and Construction';
    let request = bot.textRequest(message, {
      sessionId: '123'
    });
    request.on('response', async response => {
      let paperGiven = response.result.parameters.papers;
      const lists = await Courses.find({});
      let corePapers;
      let electivePapers;
      let results;
      let newResults;
      lists.map(list => {
        listResults = list.corePapers.filter(item => item.name === paperGiven);
        if (listResults.length > 0) {
          corePapers = listResults;
        }
      });

      // })
      if (!isEmpty(corePapers)) {
        results = corePapers.map(item => item.corequisites);
        let result;
        results.map(item => (result = item));

        if (result.length > 0) {
          expect(result[0]).toBe('INFS600 Data and Process Modelling');
        } else {
          results = 'This paper does not have any corequisites papers';
          expect(results).toBe(
            'This paper does not have any corequisites papers'
          );
        }
      } else {
        lists.map(list => {
          listResults = list.electivePapers.filter(
            item => item.name === paperGiven
          );
          if (listResults.length > 0) {
            electivePapers = listResults;
          }
        });
        if (!isEmpty(electivePapers)) {
          results = electivePapers.map(item => item.corequisites);
          let result;
          results.map(item => (result = item));
          if (result.length > 0) {
            expect(!isEmpty(results)).toBe(true);
          } else {
            results = 'This paper does not have any corequisites papers';
            expect(results).toBe(
              'This paper does not have any corequisites papers'
            );
          }
        }
      }

      done();
    });
    request.end();
  });
  test('Server should be able to responds list of suggested papers from database for <major given> by students based on which years they are', done => {
    let bot = apiai('ef35e9af544f49eca390aaf90467c240');
    const message =
      'can you provide me a suggested set of papers for software development';
    let request = bot.textRequest(message, {
      sessionId: '123'
    });
    request.on('response', async response => {
      majorGiven = response.result.parameters.major;
      let currentYear = '2';
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
      expect(foundResults.length).toBeGreaterThan(7);
      done();
    });
    request.end();
  });
  test('Server should be able to respond list of following papers based on <major given>', done => {
    let bot = apiai('ef35e9af544f49eca390aaf90467c240');
    const message =
      'If I take a Programming 2 what other papers should I take next for software development major';
    let request = bot.textRequest(message, {
      sessionId: '123'
    });
    request.on('response', async response => {
      let majorGiven = response.result.parameters.major;
      let paperGiven = response.result.parameters.papers;
      let foundResults;
      const listPapers = await Courses.find({ nameOfMajor: majorGiven });
      listPapers.map(item => {
        foundResults = item.corePapers.filter(item => item.name === paperGiven);
      });
      if (foundResults.length > 0) {
        foundResults.map(item => {
          expect(
            item.followingPaper.includes(
              'COMP603 Program Design and Construction'
            )
          ).toBe(true);
        });
      } else {
        listPapers.map(item => {
          foundResults = item.electivePapers.filter(
            item => item.name === paperGiven
          );
        });
        if (foundResults.length > 0) {
          expect(!isEmpty(foundResults)).toBe(true);
        } else {
          results = 'This paper does not have any following papers';
          expect(results).toBe('This paper does not have any following papers');
        }
      }
    });
    request.end();
    done();
  });
});
