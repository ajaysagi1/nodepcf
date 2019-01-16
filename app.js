var createError = require('http-errors');
var express = require('express');
var app = express();
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var connection = require('./database/db.connection');
var utillogger =require('./util/logger');
//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
var notesRouter = require('./routes/notes.route');


const port = 8080;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next)
{
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "*");
res.header("Access-Control-Allow-Methods","*")
next();
});


// Swagger Integration
var swaggerUi = require('swagger-ui-express'),
    YAML = require('yamljs'),
    swaggerDocument = YAML.load(path.join(__dirname + '/project.yaml'));
var options = {
    swaggerOptions: {
        docExpansion: 'none'
    }
};
app.use('/swagger', swaggerUi.serve);
app.get('/swagger', swaggerUi.setup(swaggerDocument,options));


//app.use('/', indexRouter);
//app.use('/users', usersRouter);
var verify = require('./middleware/verifyToken');
app.use('/notes', notesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
//});
app.use(function(req, res, next) {
  var err=new Error('Not Found');
  err.status=400;
  err.info="Route not Found";
  next(err);
});


// error handler
app.use((err,req,res,next)=>{
  if(err.isBoom){
    var error={
      "statusCode":400,
      "info":"check request body",
      "error":err
    };
    res.status(400).send(error);
  }
  else
  {
    if (err.name == "SequelizeDatabaseError") {
      // console.log("Invalid Column Name");
      var errorMessage = {
        "statusCode": 404,
        "info": "Invalid Column Name / Check DB Columns",
        "error": err
      };
      res.status(404).send(errorMessage);
    }
    //DB Credentials Error
    else if (err.name == "SequelizeAccessDeniedError") {
      console.log("Invalid Password")
      var errorMessage = {
        "status": 500,
        "info": "DB Credentials Error",
        "error": err
      };
      res.status(500).send(errorMessage);
    }
    //404 Error
    else if (err.statusCode == 404) {
      var errorMessage = {
        "statusCode": parseInt(err.statusCode),
        "error": err
      };
      res.status(404).json(errorMessage);
    }
    //400 Error
    else if (err.statusCode == 400) {
      var errorMessage = {
        "statusCode": parseInt(err.statusCode),
        "info": "Bad Request",
        "error": err.error
      };
      res.status(400).json(errorMessage);
    }
    //500 Error
    else {
      res.status(500).send(err);
    }
  }

});

module.exports = app;
