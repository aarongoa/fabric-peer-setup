'use strict';

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const logger = require('morgan');
const fs = require('fs');

const config = require('./config/');
const network = require('./network/router');

const app = express();

app.use(config.getEnv() === 'development' ? logger('dev') : logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/network', network);


// check if directory where files will be generated exists
fs.existsSync(config.getDirUri()) ? console.log('configured directory exists') : console.error(`\n\nERROR: ${config.getDirUri()} does not exist \n\n`);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.end("Error. Check Console.")
});

module.exports = app;
