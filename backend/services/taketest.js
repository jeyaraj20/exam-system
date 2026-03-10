// var answersheetModel = require('../models/answersheet');
// const questionModel = require('../models/question');
// var testModel = require('../models/test');
// const testRegistrationModel = require('../models/testRegistration');

// var getTestStatus = (test) => {
//   if(test.status === 'CANCELLED')
//     return test.status;
//   var status = 'CREATED'
//   var now = new Date();
//   if(Date.parse(test.resultTime) < now) {
//     status = 'RESULT_DECLARED';
//   } else if(Date.parse(test.endTime) < now) {
//     status = 'TEST_COMPLETE';
//   } else if(Date.parse(test.startTime) < now) {
//     status = 'TEST_STARTED';
//   } else if(Date.parse(test.regEndTime) < now) {
//     status = 'REGISTRATION_COMPLETE'
//   } else if(Date.parse(test.regStartTime) < now) {
//     status = 'REGISTRATION_STARTED';
//   }
//   return status;
// }

// var getAttemptEndTime = (test,startAttemptTime) => {
//   var regularEndTime = new Date(Date.parse(startAttemptTime) + (test.duration*1000));
//   var endTime = new Date(Date.parse(test.endTime));
//   return regularEndTime < endTime ? regularEndTime : endTime;
// }

// var sortByIds = (questions, questionids) => {
//   var result = [];
//   for(var i in questionids) {
//     for(var j in questions) {
//       if(questionids[i].toString() === questions[j]._id.toString()) {
//         result.push(questions[j]);
//         break;
//       }
//     }
//   }
//   return result;
// }

// var getIndex = (questionDetail,questionids) => {
//   for(var j in questionids) {
//     if(questionDetail._id.toString() === questionids[j].toString())
//       return j;
//   }
//   return -1;
// }

// var calculateMarks = async(questionids, answers, ansid) => {
//   var marks = 0;
//   var questionDetails = await questionModel.find({_id:{$in:questionids}})
//   .catch(err => {
//     console.log(err);
//   })
//   if(questionDetails.length !== questionids.length) {
//     console.log("not all questions found");
//     return;
//   }
//   for(var i in questionDetails) {
//     var index = getIndex(questionDetails[i],questionids);
//     if(index!=-1 && answers[index]!=null) {
//       if(questionDetails[i].answer.toString() === answers[index].toString()) {
//         marks += questionDetails[i].marks;
//       }
//     }
//   }

//   answersheetModel.findOneAndUpdate({_id:ansid, completed:true},{score:marks})
//   .then(result=>{
//     console.log("score is added in answersheet "+ansid);
//   })
//   .catch(err=> {
//     console.log(err);
//   })

// }

// var startTestForStudent = async(req,res,next)=> {
//   var creator = req.user || null;
//   if(creator == null || req.user.usertype != 'STUDENT') {
//     res.status(401).json({
//       success : false,
//       message : "Permissions not granted!"
//     })
//   }

//   req.check('testid','empty test id').notEmpty();

//   var errors = req.validationErrors()
//   if(errors) {
//     console.log(errors);
//     res.json({
//       success : false,
//       message : 'Invalid inputs',
//       errors : errors
//     })
//     return;
//   }

//   testModel.findById({_id:req.body.testid})
//   .then(test => {
//     if(test) {
//       var correctStatus = getTestStatus(test);
//       if(correctStatus !== test.status) {
//         updateStatus(test,correctStatus);
//         test.status = correctStatus;
//       }
//       if(test.status === 'TEST_STARTED') {
//         testRegistrationModel.find({user:creator._id,test:req.body.testid})
//         .then(testRegFind =>{
//           if(testRegFind.length > 0) {
//             answersheetModel.find({student:creator._id,test:req.body.testid})
//             .then(answersheets => {
//               if(answersheets.length > 0) {
//                 if(Date.now() > getAttemptEndTime(test,answersheets[0].startTime)) {
//                   answersheets[0].completed = true;
//                   answersheetModel.findByIdAndUpdate({_id:answersheets[0]._id},answersheets[0])
//                   .then(()=>{
//                     console.log("answer sheet marked compeleted for test "+test._id+" user "+creator._id);
//                     calculateMarks(test.questions,answersheets[0].answers, answersheets[0]._id);
//                   })
//                   .catch((err)=>{
//                     console.log(err);
//                     console.log("could not mark answersheet completed");
//                   })
//                 }
//                 if(answersheets[0].completed) {
//                   res.json({
//                     success : false,
//                     message : 'you have taken this test'
//                   })
//                 } else {
//                   res.json({
//                     success : true,
//                     message : 'test is already started',
//                     answersheet : answersheets[0],
//                     questions : test.questions
//                   })
//                 }
//               } else {
//                 var tempdata = new answersheetModel({
//                   test : req.body.testid,
//                   student : creator._id
//                 })
//                 tempdata.save((err,newdata)=>{
//                   if (err){
//                     console.log(err);
//                     res.status(500).json({
//                       success : false,
//                       message : "Unable to start test"
//                     })
//                   } else {
//                     res.json({
//                       success : true,
//                       message : 'Test started',
//                       answersheet : newdata,
//                       questions : test.questions
//                     })
//                   }
//                 })
//               }
//             })

//           } else {
//             res.json({
//               success : false,
//               message : "You are not registered"
//             })
//           }
//         })
//         .catch(err=>{
//           console.log(err);
//           res.json({
//             success : false,
//             message : "Unable to start test"
//           })
//         })
//       } else if(test.status === 'TEST_COMPLETE') {
//         res.json({
//           success : false,
//           message : "Test time is over"
//         })
//       } else {
//         res.json({
//           success : false,
//           message : "Test is not started"
//         })
//       }
//     } else {
//       res.json({
//         success : false,
//         message : "Unable to find test"
//       })
//     }
//   }).catch(err => {
//     console.log(err);
//     res.json({
//       success : false,
//       message : "Unable to start test"
//     })
//   })
// }

// var getQuestionsAndSetStartTime = async(req,res,next)=> {
//   var creator = req.user || null;
//   if(creator == null || req.user.usertype != 'STUDENT') {
//     res.status(401).json({
//       success : false,
//       message : "Permissions not granted!"
//     })
//   }

//   req.check('addStartTime','boolean to add start time not found').isBoolean();
//   req.check('answersheetid','answersheet id not found').notEmpty();
//   req.check('questionid','Invalid length of list of question').isArray({min:1});
//   req.check('questionid.*','Invalid question id').notEmpty();

//   var errors = req.validationErrors()
//   if(errors) {
//     console.log(errors);
//     res.json({
//       success:false,
//       message: 'Invalid inputs',
//       errors : errors
//     })
//     return;
//   }

//   var ques = await questionModel.find({_id:{$in:req.body.questionid}});
//   var questions = sortByIds(ques,req.body.questionid);

//   var startTime = "";
//   if(req.body.addStartTime) {
//     startTime = new Date();
//     var answersheet = await answersheetModel.findByIdAndUpdate({_id:req.body.answersheetid},{startTime:startTime })
//     .catch((err=> {
//       res.json({
//         success : false,
//         message : "Internal server error"
//       })
//       return;
//     }))
//   } else {
//     var answersheet = await answersheetModel.findById({_id:req.body.answersheetid})
//     .catch((err=> {
//       res.json({
//         success : false,
//         message : "Internal server error"
//       })
//       return;
//     }))
//     if(answersheet) {
//       startTime = answersheet.startTime;
//     }
//   }
//   console.log(startTime);
//   if(startTime>0) {
//     res.json({
//       success : true,
//       startTime : startTime,
//       questions : questions.map(x=>({
//         _id:x._id,
//         body:x.body,
//         options:x.options,
//         marks : x.marks,
//         subject: x.subject
//       }))
//     })
//   } else {
//     res.json({
//       success : false,
//       message : "answersheet not found"
//     })
//   }

// }

// var saveAnswer = async(req,res,next) => {
//   var creator = req.user || null;
//   if(creator == null || req.user.usertype != 'STUDENT') {
//     res.status(401).json({
//       success : false,
//       message : "Permissions not granted!"
//     })
//   }

//   req.check('answersheetid','answersheet id not found').notEmpty();
//   req.check('answers','Invalid length of list of answers').isArray({min:1});

//   var errors = req.validationErrors()
//   if(errors) {
//     console.log(errors);
//     res.json({
//       success:false,
//       message: 'Invalid inputs',
//       errors : errors
//     })
//     return;
//   }

//   var answersheet = await answersheetModel.findById({_id:req.body.answersheetid})
//   .catch((err=> {
//     res.json({
//       success : false,
//       message : "Internal server error"
//     })
//     return;
//   }))
//   if(answersheet) {
//     if(answersheet.completed) {
//       res.json({
//         success : true,
//         testDone : true,
//         message : "Test is completed"
//       })
//       return;
//     }
//     var test = await testModel.findById({_id:answersheet.test})
//     .catch((err)=>{
//       console.log(err);
//       console.log("could not mark answersheet completed");
//     })

//     if(Date.now() - getAttemptEndTime(test,answersheet.startTime) > 0) {
//       answersheetModel.findByIdAndUpdate({_id:req.body.answersheetid},{answers: req.body.answers,completed : true})
//       .then(()=>{
//         res.json({
//           success : true,
//           testDone : true,
//           message : "answers updated"
//         })
//         calculateMarks(test.questions, req.body.answers, req.body.answersheetid);
//       }).catch((err)=>{
//         console.log(err);
//         console.log("could not update answers and complete test");
//       })
//     }
//     else {
//       answersheetModel.findByIdAndUpdate({_id:req.body.answersheetid},{answers: req.body.answers})
//       .then(()=>{
//         res.json({
//           success : true,
//           testDone : false,
//           message : "answers updated"
//         })
//       }).catch((err)=>{
//         console.log(err);
//         console.log("could not update answers");
//       })
//     }
//   } else {
//     res.json({
//       success : false,
//       message : "Answersheet not found"
//     })
//   }
// }

// const saveAnswerandEndTest = async(req,res,next)=> {
//   var creator = req.user || null;
//   if(creator == null || req.user.usertype != 'STUDENT') {
//     res.status(401).json({
//       success : false,
//       message : "Permissions not granted!"
//     })
//   }

//   req.check('answersheetid','answersheet id not found').notEmpty();
//   req.check('answers','Invalid length of list of answers').isArray({min:1});

//   var answersheet = await answersheetModel.findById({_id:req.body.answersheetid})
//   .catch((err=> {
//     res.json({
//       success : false,
//       message : "Internal server error"
//     })
//     return;
//   }))

//   if(answersheet) {
//     if(answersheet.completed) {
//       res.json({
//         success : false,
//         message : "Test is completed"
//       })
//       return;
//     }
//     var test = await testModel.findById({_id:answersheet.test})
//     .catch((err)=>{
//       console.log(err);
//       console.log("could not mark answersheet completed");
//     })

//     if(Date.now() - getAttemptEndTime(test,answersheet.startTime) > 10*1000) {
//       answersheet.completed = true;
//       answersheetModel.findByIdAndUpdate({_id:req.body.answersheetid},answersheet)
//       .then(()=>{
//         console.log("answer sheet marked compeleted for test "+test._id+" user "+creator._id);
//         res.json({
//           success : true,
//           message : "Test is completed"
//         })
//         calculateMarks(test.questions,  answersheet.answers, answersheet._id);
//       })
//       .catch((err)=>{
//         console.log(err);
//         console.log("could not mark answersheet completed");
//       })
//     } else {
//       answersheetModel.findByIdAndUpdate({_id:req.body.answersheetid},{answers: req.body.answers,completed : true})
//       .then(()=>{
//         res.json({
//           success : true,
//           message : "Test is completed"
//         })
//         calculateMarks(test.questions,  req.body.answers, answersheet._id);
//       }).catch((err)=>{
//         console.log(err);
//         console.log("could not update answers and complete test");
//       })
//     }

//   } else {
//     res.json({
//       success : false,
//       message : "Answersheet not found"
//     })
//   }
// }

// module.exports = {
//   startTestForStudent,
//   getQuestionsAndSetStartTime,
//   saveAnswer,
//   saveAnswerandEndTest
// }

const answersheetModel = require("../models/answersheet");
const questionModel = require("../models/question");
const testModel = require("../models/test");
const testRegistrationModel = require("../models/testRegistration");

// Helper functions
const getTestStatus = (test) => {
  if (!test) return "UNKNOWN";
  if (test.status === "CANCELLED") return test.status;

  const now = new Date();
  if (new Date(test.resultTime) < now) return "RESULT_DECLARED";
  if (new Date(test.endTime) < now) return "TEST_COMPLETE";
  if (new Date(test.startTime) < now) return "TEST_STARTED";
  if (new Date(test.regEndTime) < now) return "REGISTRATION_COMPLETE";
  if (new Date(test.regStartTime) < now) return "REGISTRATION_STARTED";
  return "CREATED";
};

const getAttemptEndTime = (test, startAttemptTime) => {
  const regularEndTime = new Date(
    new Date(startAttemptTime).getTime() + test.duration * 1000,
  );
  const endTime = new Date(test.endTime);
  return regularEndTime < endTime ? regularEndTime : endTime;
};

const sortByIds = (questions, questionids) => {
  const result = [];
  questionids.forEach((id) => {
    const q = questions.find((q) => q._id.toString() === id.toString());
    if (q) result.push(q);
  });
  return result;
};

const calculateMarks = async (questionids, answers, ansid) => {
  try {
    const questionDetails = await questionModel
      .find({ _id: { $in: questionids } })
      .lean();
    if (questionDetails.length !== questionids.length) {
      console.warn("Not all questions found");
      return;
    }

    let marks = 0;
    questionDetails.forEach((q, i) => {
      const index = questionids.findIndex(
        (id) => id.toString() === q._id.toString(),
      );
      if (
        index !== -1 &&
        answers[index] != null &&
        q.answer.toString() === answers[index].toString()
      ) {
        marks += q.marks;
      }
    });

    await answersheetModel.findByIdAndUpdate(ansid, { score: marks });
    console.log(`Score updated for answersheet ${ansid}`);
  } catch (err) {
    console.error(err);
  }
};

// ================== Controllers ================== //

const startTestForStudent = async (req, res) => {
  try {
    const creator = req.user;

    if (!creator || creator.usertype !== "STUDENT") {
      return res
        .status(401)
        .json({ success: false, message: "Permissions not granted!" });
    }

    if (!req.body.testid) {
      return res.status(400).json({
        success: false,
        message: "Empty test id",
      });
    }

    const test = await testModel.findById(req.body.testid).lean();

    if (!test) {
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    }

    const correctStatus = getTestStatus(test);

    if (correctStatus !== test.status) {
      await testModel.findByIdAndUpdate(test._id, { status: correctStatus });
      test.status = correctStatus;
    }

    if (test.status !== "TEST_STARTED") {
      return res.json({
        success: false,
        message:
          test.status === "TEST_COMPLETE"
            ? "Test time is over"
            : "Test is not started",
      });
    }

    const reg = await testRegistrationModel.findOne({
      user: creator._id,
      test: test._id,
    });

    if (!reg) {
      return res.json({
        success: false,
        message: "You are not registered",
      });
    }

    let answersheet = await answersheetModel.findOne({
      student: creator._id,
      test: test._id,
    });

    if (!answersheet) {
      answersheet = await answersheetModel.create({
        test: test._id,
        student: creator._id,
      });

      return res.json({
        success: true,
        message: "Test started",
        answersheet,
        questions: test.questions,
      });
    }

    const attemptEndTime = getAttemptEndTime(test, answersheet.startTime);

    if (Date.now() > attemptEndTime) {
      answersheet.completed = true;

      await answersheetModel.findByIdAndUpdate(answersheet._id, answersheet);

      await calculateMarks(
        test.questions,
        answersheet.answers,
        answersheet._id,
      );

      return res.json({
        success: false,
        message: "You have taken this test",
      });
    }

    return res.json({
      success: true,
      message: "Test is already started",
      answersheet,
      questions: test.questions,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Unable to start test",
    });
  }
};

const getQuestionsAndSetStartTime = async (req, res) => {
  try {
    const creator = req.user;

    if (!creator || creator.usertype !== "STUDENT") {
      return res
        .status(401)
        .json({ success: false, message: "Permissions not granted!" });
    }

    const { addStartTime, answersheetid, questionid } = req.body;

    // Validation
    if (typeof addStartTime !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Boolean to add start time not found",
      });
    }

    if (!answersheetid) {
      return res.status(400).json({
        success: false,
        message: "Answersheet id not found",
      });
    }

    if (!Array.isArray(questionid) || questionid.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid length of question list",
      });
    }

    if (questionid.some((id) => !id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question id",
      });
    }

    const questions = await questionModel
      .find({ _id: { $in: questionid } })
      .lean();

    const sortedQuestions = sortByIds(questions, questionid);

    let startTime;

    if (addStartTime) {
      startTime = new Date();

      await answersheetModel.findByIdAndUpdate(answersheetid, {
        startTime,
      });
    } else {
      const answersheet = await answersheetModel.findById(answersheetid).lean();

      if (!answersheet) {
        return res.status(404).json({
          success: false,
          message: "Answersheet not found",
        });
      }

      startTime = answersheet.startTime;
    }

    return res.json({
      success: true,
      startTime,
      questions: sortedQuestions.map((q) => ({
        _id: q._id,
        body: q.body,
        options: q.options,
        marks: q.marks,
        subject: q.subject,
      })),
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// Save answer (without ending test)
const saveAnswer = async (req, res) => {
  try {
    const creator = req.user;
    if (!creator || creator.usertype !== "STUDENT")
      return res
        .status(401)
        .json({ success: false, message: "Permissions not granted!" });

    req.check("answersheetid", "Answersheet id not found").notEmpty();
    req.check("answers", "Invalid length of answers list").isArray({ min: 1 });

    const errors = req.validationErrors();
    if (errors)
      return res
        .status(400)
        .json({ success: false, message: "Invalid inputs", errors });

    const answersheet = await answersheetModel.findById(req.body.answersheetid);
    if (!answersheet)
      return res
        .status(404)
        .json({ success: false, message: "Answersheet not found" });
    if (answersheet.completed)
      return res.json({
        success: true,
        testDone: true,
        message: "Test is completed",
      });

    const test = await testModel.findById(answersheet.test).lean();
    if (!test)
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });

    const attemptEndTime = getAttemptEndTime(test, answersheet.startTime);
    if (Date.now() > attemptEndTime) {
      answersheet.completed = true;
      await answersheetModel.findByIdAndUpdate(answersheet._id, {
        answers: req.body.answers,
        completed: true,
      });
      await calculateMarks(test.questions, req.body.answers, answersheet._id);
      return res.json({
        success: true,
        testDone: true,
        message: "Test completed",
      });
    }

    await answersheetModel.findByIdAndUpdate(answersheet._id, {
      answers: req.body.answers,
    });
    return res.json({
      success: true,
      testDone: false,
      message: "Answers updated",
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Save answer and end test immediately
const saveAnswerandEndTest = async (req, res) => {
  try {
    const creator = req.user;

    if (!creator || creator.usertype !== "STUDENT") {
      return res
        .status(401)
        .json({ success: false, message: "Permissions not granted!" });
    }

    const { answersheetid, answers } = req.body;

    // Validation
    if (!answersheetid) {
      return res.status(400).json({
        success: false,
        message: "Answersheet id not found",
      });
    }

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid length of answers list",
      });
    }

    const answersheet = await answersheetModel.findById(answersheetid);

    if (!answersheet) {
      return res.status(404).json({
        success: false,
        message: "Answersheet not found",
      });
    }

    if (answersheet.completed) {
      return res.json({
        success: false,
        message: "Test is completed",
      });
    }

    const test = await testModel.findById(answersheet.test).lean();

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    // Update answers and complete test
    await answersheetModel.findByIdAndUpdate(answersheet._id, {
      answers,
      completed: true,
    });

    await calculateMarks(test.questions, answers, answersheet._id);

    return res.json({
      success: true,
      message: "Test is completed",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  startTestForStudent,
  getQuestionsAndSetStartTime,
  saveAnswer,
  saveAnswerandEndTest,
};
