const logger = require('../util/logger');
const STATUS_CODES = require('../util/statusCodes');
const userModel = require('../models/users.model');
const hostModel = require('../models/hostNotes.model');
const attendeeModel = require('../models/attendeesNotes.model');
const jwt = require('jsonwebtoken');
var Sequelize = require('sequelize');

var Op = Sequelize.Op;


//Token Generation for Security Purpose
var tokenGen = async (req, res, next) => {
  console.log("URL hit to :", req.hostname, req.originalUrl);
  logger.info("Entered into token generation service");
  try {
    var token = await jwt.sign({ Email: 'users' }, "ANNAPURNA", { expiresIn: '1d' });
    res.status(STATUS_CODES.OK).send({
      "statusCode": STATUS_CODES.OK,
      "info": "token generated successfully",
      "token": token
    })
  }
  catch (e) {
    next(e);
  }

}

//This API is used to login particular user

var getUserData = async (req, res, next) => {

  //logger
  console.log("URL hit to :", req.hostname, req.originalUrl);
  logger.info("Entered into get userData Service");
  try {
    var data = await userModel.User.findOne({
      where: {
        Email: req.query.Email,
        Password: req.query.Password
      },
    });

    //Subordinates data reports to User
    var sub = await userModel.User.findAll({
      where: {
        ReportsTo: req.query.Email,
      },
    });

    var login_data = [];
    data != null ? login_data.push(data) : login_data = 0;
    if (login_data) {

      login_data.map(function (item) {
        console.log(item.Password, req.query.Password)
        if (item.Password == req.query.Password && item.Email == req.query.Email) {

          item.Password = '*******'
          delete item['Password']

          res.status(STATUS_CODES.OK).send({
            "statusCode": STATUS_CODES.OK,
            "info": "Successfully Logged in",
            "LoginData": item,
            "Subordinates": sub
          })
        }
        else {
          res.status(STATUS_CODES.BAD_REQUEST).send({
            "statusCode": STATUS_CODES.BAD_REQUEST,
            "info": "Incorrect Email/Password"
          })
        }
      })
    } else {
      res.status(STATUS_CODES.NOT_FOUND).send({
        "statusCode": STATUS_CODES.NOT_FOUND,
        "info": "No Data Found"
      })

    }

  } catch (e) {
    logger.error(e.message);
    next(e);
  }

}


//This API is used to get allnotes hosted by particular user

var getAllMeetings = async (req, res, next) => {

  //logger
  console.log("URL hit to :", req.hostname, req.originalUrl);
  logger.info("Entered into get userData Service");
  try {

    let hostData = await hostModel.Host.findAll({
      where: {
        HostUserId: req.query.HostUserId
      }
    });
    let attendeeData = await attendeeModel.Attendees.findAll({
      where:
      {
        AttendeeUserId: req.query.HostUserId
      }
    })
    var data = attendeeData;
    console.log(data.AttendeeUserId);
    if (attendeeData) {
      res.status(STATUS_CODES.OK).send({
        "statusCode": STATUS_CODES.OK,
        "info": "User",
        "InvitedNotes": attendeeData
      })
    }
  

  var login_data =[];
    attendeeData != null  ?   login_data.push(attendeeData)  :   login_data=0;
    if (login_data) {

      login_data.map(function(item){
        console.log(item.AttendeeUserId,req.query.HostUserId)
      })
    }
  }
  catch (e) {
    logger.error(e.message);
    next(e);
  }

}

//This API is used to get allnotes hosted by particular user

var getNotes = async (req, res, next) => {

  //logger
  console.log("URL hit to :", req.hostname, req.originalUrl);
  logger.info("Entered into get userData Service");
  try {

    let hostData = await hostModel.Host.findAll({
      where: {
        Email: req.query.Email,
        HostUserId: req.query.HostUserId,
        IsDeleted : 0
      }
    })

    let attendeeData = await attendeeModel.Attendees.findAll({
      where:
      {
        AttendeeUserId: req.query.HostUserId
      }
    })
    //console.log("Data", hostData.Attendees);
    if (hostData) {
      var len = hostData.length;
      for (var i = 0; i < len; i++) {
        hostData[i].Attendees = JSON.parse(hostData[i].Attendees);
      }
    }
    res.status(STATUS_CODES.OK).send({
      "statusCode": STATUS_CODES.OK,
      "info": "User",
      "Created Notes": hostData,
      "Invited Notes": attendeeData
    })


  } catch (e) {
    logger.error(e.message);
    next(e);
  }

}

//This API is used to get All Users except Host User
var getUsers = async (req, res, next) => {

  //logger
  console.log("URL hit to :", req.hostname, req.originalUrl);
  logger.info("Entered into get users Service");
  try {
    var data = [];
    var data2 = [];
    var Email = req.query.Email;
    let userData = await userModel.User.findAll({
      where: {
        IsDeleted: 0,
      },
      where:
      {
        ReportsTo: {
          [Op.ne]: Email
        }
      },
      
      attributes:
      {
        exclude: ['Password']
      }
    });

    for (var i = 0; i < userData.length; i++) {
      if (userData[i].Email != req.query.Email) {
        data.push(userData[i]);
      }
    }
    if(userData){
    res.status(STATUS_CODES.OK).send({
      "statusCode": STATUS_CODES.OK,
      "info": "List of Users",
      "Users": data
    })
  } else{
    res.status(STATUS_CODES.NOT_FOUND).send({
      "statusCode": STATUS_CODES.NOT_FOUND,
      "info": "Email Not Found",
      //"Users": data
    })
  }
  } catch (e) {
    logger.error(e.message);
    next(e);
  }
}

//This API is used to addNote

var addNotes = async (req, res, next) => {
  //logger
  console.log("URL hit to", req.hostname, req.originalUrl);
  logger.info("Entered into add notes service");
  try {
    var payload = req.body;
    payload.Attendees = JSON.stringify(req.body.Attendees)
    // console.log(payload)
    if (payload != undefined) {
      var noteData = await hostModel.Host.create(payload);
      //console.log(noteData);
      // console.log(JSON.parse(noteData.Attendees).length)
      var userData = await userModel.User.findAll();
      console.log(userData);
      var att_len = JSON.parse(noteData.Attendees);
      if (att_len) {
        for (var i = 0; i < att_len.length; i++) {
          var attendeeData = await attendeeModel.Attendees.create({
            HostId: noteData.Id,
            HostUserId: noteData.HostUserId,
            HostEmail: noteData.Email,
            HostName: noteData.HostName,
            AttendeeUserId: att_len[i].AttendeeUserId,
            AttendeeEmail: userData[i].Email,
            Title: noteData.Title,
            Description: noteData.Description,
            Summary: noteData.Summary,
            HostDate: noteData.HostDate,
            CreatedOn:noteData.CreatedOn,
            MofifiedOn: noteData.MofifiedOn,
            CreatedBy:noteData.CreatedBy,
            ModifiedBy:noteData.ModifiedBy
          })
          if (i == att_len.length - 1) {
            res.status(STATUS_CODES.OK).send({
              "statusCode": STATUS_CODES.OK,
              "info": "Successfully Note Addded",
            })
          }
        }
      }

    }
  } catch (e) {
    logger.error(e.message);
  }
}

//This API is used to add Attendees to a particular meeting
var addAttendees = async (req, res, next) => {
  console.log("URL hit to", req.hostname, req.originalUrl);
  logger.info("Entered into add Attendees service");
  try {

    var payload = req.body;
    if (payload != undefined) {
      var attendeeData = await attendeeModel.Attendees.create(payload);
      res.status(STATUS_CODES.OK).send({
        "statusCode": STATUS_CODES.OK,
        "info": "Successfully Attendee Addded",
        //"Attendees" : attendeeData
      })
    }
  } catch (e) {
    logger.error(e);
    next(e);
  }

}

//This API is used to update the meeting Note

var updateNotes = async (req, res, next) => {

  console.log("URL hit to", req.hostname, req.originalUrl);
  logger.info("Entered into update notes service");
  try {
    var updateData = await hostModel.Host.update({
      Title: req.body.Title,
      Description: req.body.Description,
      Summary: req.body.Summary,
      HostDate: req.body.HostDate
    }, {
        where: {
          Email: req.query.Email,
          Id: req.query.Id
        }
      })
    var up_data = await attendeeModel.Attendees.update({
      Title: req.body.Title,
      Description: req.body.Description,
      Summary: req.body.Summary,
      HostDate: req.body.HostDate
    }, {
        where: {
          HostEmail: req.query.Email,
          HostId: req.query.Id
        }
      })
    var hostData = await hostModel.Host.findAll({
      where: {
        Email: req.query.Email,
        Id: req.query.Id
      }
    });
    var host_len = hostData.length;
    for (var i = 0; i < host_len; i++) {

      hostData[i].Attendees = JSON.parse(hostData[i].Attendees);
      var att_len = hostData[i].Attendees;
      for (var j = 0; j < att_len.length; j++) {
        att_len[j].Title = req.body.Title;
        att_len[j].Description = req.body.Description;
        att_len[j].Summary = req.body.Summary;
        //att_len[j].HostDate = req.body.HostDate;
        if (i == host_len - 1 && j == att_len.length - 1) {
          var hostup_data = await hostModel.Host.update({
            Attendees: JSON.stringify(att_len)
          }, {
              where: {
                Email: req.query.Email,
                Id: req.query.Id
              }
            }).then(function (d) {
              if (updateData != 0 || updateData != undefined) {
                res.status(STATUS_CODES.OK).send({
                  "statusCode": STATUS_CODES.OK,
                  "info": "Successsfully Note Updated"
                })
              } else {
                res.status(STATUS_CODES.NOT_FOUND).send({
                  "statusCode": STATUS_CODES.NOT_FOUND,
                  "info": "Email Not Found"
                })
              }
            })
        }
      }
    }

  } catch (e) {
    logger.error(e.message);
    next(e);
  }
}

var deleteNotes = async (req, res, next) => {

  console.log("URL hit to", req.hostname, req.originalUrl);
  logger.info("Entered into delete notes service");
  try {
    var deleteData = await hostModel.Host.update({
      IsDeleted: 1
    }, {
        where: {
          Email: req.query.Email,
          Id: req.query.Id
        }
      });
    var del_Data = await attendeeModel.Attendees.update({
      IsDeleted: 1
    }, {
        where: {
          HostEmail: req.query.Email,
          HostId: req.query.Id
        }
      });
    var data = deleteData;
    if (data != 0 || data != undefined) {
      res.status(STATUS_CODES.OK).send({
        "statuscode": STATUS_CODES.OK,
        "info": "Successfully Deleted"

      })
    } else {
      res.status(STATUS_CODES.NOT_FOUND).send({
        "statusCode": STATUS_CODES.NOT_FOUND,
        "info": "Email Not Found"
      })
    }
  } catch (e) {
    logger.error(e);
    next(e);
  }
}
module.exports = {
  tokenGen: tokenGen,
  getUserData: getUserData,
  getNotes: getNotes,
  getAllMeetings: getAllMeetings,
  getUsers: getUsers,
  addNotes: addNotes,
  addAttendees: addAttendees,
  updateNotes: updateNotes,
  deleteNotes: deleteNotes
}