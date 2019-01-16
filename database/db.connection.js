var Sequelize = require('sequelize');
var Op = Sequelize.Op;
var logger = require('../util/logger');

var connection = new Sequelize('ad_814c67fb31c66bd','b6ac1d37df195f','b238ec39',{
    host: 'us-cdbr-iron-east-01.cleardb.net',
    port: 3306,
    dialect: 'mysql',
    operatorsAliases: Op, // use Sequelize.Op.
    logging: false,
});

connection.authenticate()
.then(function (){
    logger.info("Database Connection Established");
})
.catch(function (err){
    logger.info("Error connecting to Database");
})
.done();

module.exports = connection;