var joi = require('joi');

var userSchema={
    body:{
        UserName : joi.string().required(),
        Email : joi.string().required(),
        Designation : joi.string().required(),
        Location : joi.string().required(),
        Department : joi.string().required(),
        ReportsTo : joi.string().required(),
        IsDeleted : joi.number().required(),
        CreatedOn : joi.string().required(),
        ModifiedOn : joi.string().required(),
        CreatedBy : joi.string().allow(null),
        ModifiedBy : joi.string().allow(null),
        Password : joi.string().required()
       //IsHosted : joi.string().required()
    }
}

var hostSchema={
    body:{
        HostUserId : joi.number().required(),
        Title : joi.string().required(),
        Description : joi.string().required(),
        Attendees : joi.any().allow("").allow(null),
        HostName : joi.string().required(),
        HostDate : joi.date().required(),
        Email : joi.string().required(),
        Summary : joi.string().required(),
        IsDeleted : joi.number().required(),
        //CreatedOn : joi.string().required(),
       // ModifiedOn : joi.string().allow(""),
        CreatedBy : joi.string().allow(null).allow(""),
        ModifiedBy : joi.string().allow(null).allow("")
    }
}

var attendeeSchema={
    body:{
        HostId : joi.number().required(),
        HostUserId : joi.number().required(),
        HostEmail : joi.string(),
        HostName: joi.string().required(),
        AttendeeUserId : joi.number().required(),
        Title : joi.string().required(),
        Description : joi.string().required(),
        Summary : joi.string().required(),
        IsDeleted : joi.number().required(),
        CreatedBy: joi.string().allow(null).allow(""),
        ModifiedBy: joi.string().allow(null).allow(""),
        HostDate : joi.date().required(),
        Status : joi.string().required()
    }
}

module.exports={
    userSchema : userSchema,
    hostSchema : hostSchema,
    attendeeSchema : attendeeSchema
}