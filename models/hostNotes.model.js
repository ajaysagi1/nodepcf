var sequelize = require('sequelize');
var dbConnection = require('../database/db.connection');

var Host = dbConnection.define('hostnotes',{
    Id:{type:sequelize.INTEGER, autoIncrement:true, primaryKey:true},
    HostUserId:{type:sequelize.INTEGER,  foreignKey:true},
    Title : sequelize.STRING,
    Description : sequelize.TEXT,
    Attendees : sequelize.BLOB,
    HostName : sequelize.STRING,
    HostDate : sequelize.DATE,
    Email : sequelize.STRING,
    Summary : sequelize.STRING,
    IsDeleted : sequelize.INTEGER,
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
    ModifiedBy : {type:sequelize.STRING,defaultValue:null}
},{
    timestamps : false,
    freezeTableName : true,
    tableName : 'hostnotes'
});

module.exports = {
    Host : Host
}