var sequelize = require('sequelize');
var dbConnection = require('../database/db.connection');

var User = dbConnection.define('users',{
    UserId:{type:sequelize.INTEGER, autoIncrement:true, primaryKey:true},
    UserName : sequelize.STRING,
    Email : sequelize.STRING,
    Designation : sequelize.STRING,
    Location : sequelize.STRING,
    Department : sequelize.STRING,
    ReportsTo : sequelize.STRING,
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
    ModifiedBy : {type:sequelize.STRING,defaultValue:null},
    Password : sequelize.STRING
    //IsHosted : sequelize.INTEGER
},{
    timestamps : false,
    freezeTableName : true,
    tableName : 'users'
});

module.exports = {
    User : User
}