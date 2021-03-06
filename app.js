var http = require('http');
var express = require('express');
var app = express();
var port = normalizePort(process.env.PORT || '3001');
app.set('port', port);
var server = http.createServer(app);

var debug = require('debug')('dashboardnodejs:server');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var initKafkaConsumer = require('./handlers/kafkaHandlerConsumer');
var indexRouter = require('./routes/index');
var locals = require('./handlers/locals');
const SocketIOSDK = require('./services/socketIoSdk');
const redisService = require('./services/redisClientSdk');

var socket = new SocketIOSDK(server);

initKafkaConsumer(socket);
// initConfusionMatrix();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(process.cwd() + '/public'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.locals = locals



console.log('server is listening on port: ', port);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function initConfusionMatrix() {
  const matrix = [
    [0, 1, 2, 3, 4, 5],
    [1, 0, 0, 0, 0, 0],
    [2, 0, 0, 0, 0, 0],
    [3, 0, 0, 0, 0, 0],
    [4, 0, 0, 0, 0, 0],
    [5, 0, 0, 0, 0, 0]
  ]
  redisService.set('confusion-matrix', JSON.stringify(matrix));
}

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

