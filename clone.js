const logger = require('../util/logger');
const STATUS_CODES = require('../util/statuscodes');
const userModel = require('../models/users.model');
const hostModel = require('../models/hostNotes.model');
const attendeeModel = require('../models/attendeesNotes.model');

//This API is used to login particular user

var getUserData = async (req, res, next) => {

    //logger
    console.log("URL hit to :", req.hostname, req.originalUrl);
    logger.info("Entered into get userData Service");
    try {
        var data = await userModel.User.findOne({
            where:
            {
                Email: req.query.Email,
                Password: req.query.Password
            }
        });
        if (data) {

            res.status(STATUS_CODES.OK).send({
                "statusCode": STATUS_CODES.OK,
                "info": "User Successfully logged in",
                "UserDetails": data
            })

        }
        else {
            res.status(STATUS_CODES.BAD_REQUEST).send({
                "statusCode": STATUS_CODES.BAD_REQUEST,
                "info": "Incorrect Email/Password"
                //"HostDetails" : data
            })

        }

    }
    catch (e) {
        logger.error(e);
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
            where:
            {
                Email: req.query.Email
            }
        })
        console.log("Data", hostData.Attendees);
        if (hostData) {
            //res.send(hostData)
            hostData[0].Attendees = JSON.parse(hostData[0].Attendees);
            res.status(STATUS_CODES.OK).send({
                "statusCode": STATUS_CODES.OK,
                "info": "User",
                "AllNotes": hostData
            })

        }
    }
    catch (e) {
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
        var Email = req.query.Email;
        let userData = await userModel.User.findAll({
            where:
            {
                isDeleted: 0
            }

        });
        for (var i = 0; i < userData.length; i++) {
            if (userData[i].Email != req.query.Email) {
                data.push(userData[i]);
            }
        }
        res.status(STATUS_CODES.OK).send({
            "statusCode": STATUS_CODES.OK,
            "info": "List of Users",
            "Users": data
        })
         // for (var i = 0; i < userData.length; i++) {
    //   if (userData[i].Email != req.query.Email) {
    //     data.push(userData[i]);
    //   } else {
    //     data2.push(userData[i]);
    //     var login_data = [];
    //     data2 != null ? login_data.push(data2) : login_data = 0;
    //     if (login_data) {

    //       login_data.map(function (item) {
    //         //console.log(item.Password,req.query.Password)
    //         if (item.Email != req.query.Email) {
    //           res.status(STATUS_CODES.OK).send({
    //             "statusCode": STATUS_CODES.OK,
    //             "info": "List of Users",
    //             "Users": data
    //           })
    //         }
    //       })
    //     }
    //   }
    //   if (i == userData.length - 1) {
    //     if (data.length == 0) {
    //       res.send("NO USER FOUND")
    //     } else {
    //       res.status(STATUS_CODES.OK).send({
    //         "statusCode": STATUS_CODES.OK,
    //         "info": "List of Users",
    //         //"Users": data2
    //       })
    //     }
    //   }
    // }

    }
    catch (e) {
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
            var att_len = JSON.parse(noteData.Attendees);
            if (att_len) {
                for (var i = 0; i < att_len.length; i++) {
                    var attendeeData = await attendeeModel.Attendees.create({
                        HostId: noteData.Id,
                        HostUserId: noteData.HostUserId,
                        AttendeeUserId: att_len[i].AttendeeUserId,
                        Title: noteData.Title,
                        Description: noteData.Description,
                        Summary: noteData.Summary
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
    }
    catch (e) {
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
    }
    catch (e) {
        logger.error(e);
        next(e);
    }

}


var updateNotes = async (req, res, next) => {

    console.log("URL hit to", req.hostname, req.originalUrl);
    logger.info("Entered into update notes service");
    try {
        var hostData = await hostModel.Host.findAll({
            where:
            {
                Email : req.query.Email
            }
        })
        console.log(hostData)
        var updateData = await hostModel.Host.update({
            Title: req.body.Title,
            Summary: req.body.Summary,
            Description: req.body.Description
        }, {
                where:
                {
                    Email: req.query.Email
                }
            });
        if (updateData != undefined) {
            res.status(STATUS_CODES.OK).send({
                "statusCode": STATUS_CODES.OK,
                "info": "Successfully Note Updated"
            })
        }
    }
    catch (e) {
        logger.error(e);
        next(e);
    }
}

var deleteNotes = async (req, res, next) => {

    console.log("URL hit to", req.hostname, req.originalUrl);
    logger.info("Entered into delete notes service");
    try {
        var deleteData = await userModel.User.update(
            { IsDeleted: 1 },
            {
                where:
                {
                    Email: req.query.Email
                }
            });
        if (deleteData != undefined) {
            res.status(STATUS_CODES.OK).send({
                "statuscode": STATUS_CODES.OK,
                "info": "Successfully Deleted"

            })
        }
    }
    catch (e) {
        logger.error(e);
        next(e);
    }
}
module.exports = {
    getUserData: getUserData,
    getNotes: getNotes,
    getUsers: getUsers,
    addNotes: addNotes,
    addAttendees: addAttendees,
    updateNotes: updateNotes,
    deleteNotes: deleteNotes
}