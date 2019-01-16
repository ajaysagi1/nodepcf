var sequelize = require('sequelize');
var dbConnection = require('../database/db.connection');

var Attendees = dbConnection.define('attendeesnotes',{
    Id:{type:sequelize.INTEGER, autoIncrement:true, primaryKey:true},
    HostId:{type:sequelize.INTEGER,  foreignKey:true},
    HostUserId:sequelize.INTEGER,
    HostEmail:sequelize.STRING,
    HostName:sequelize.STRING,
    AttendeeUserId:sequelize.INTEGER,
    AttendeeEmail:sequelize.STRING,
    Title : sequelize.STRING,
    Description : sequelize.STRING,
    Summary : sequelize.STRING,
    IsDeleted : sequelize.INTEGER,
    HostDate:sequelize.DATE,
    CreatedOn: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
    ModifiedOn : {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull : false
    },
    CreatedBy : {type: sequelize.STRING,defaultValue:null},
    ModifiedBy : {type:sequelize.STRING,defaultValue:null},
    Status:sequelize.CHAR
},{
    timestamps : false,
    freezeTableName : true,
    tableName : 'attendeesnotes'
});

module.exports = {
    Attendees : Attendees
}