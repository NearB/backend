var mongoose = require('mongoose');
var mockgoose = require('mockgoose');

mongoose.Promise = Promise;

function connect() {
  if (process.env.TESTING){
    console.log("MONGOOSE TESTING MODE");
    mockgoose(mongoose).then(function() {
        mongoose.connect('mongodb://example.com/TestingDB');
    });
  } else {
    console.log("MONGOOSE users_db_PORT: "+ process.env.users_db_PORT);
    mongoose.connect(`mongodb://localhost:${process.env.users_db_PORT}/local`);
  }
}

// Had to write a retry function because fuge can't handle dependencies between containers
var retries = 0,
  MAX_RETRIES = 5,
  WAIT_BEFORE_RETRY = 1000;

setTimeout(connect, WAIT_BEFORE_RETRY);
mongoose.connection.on('error', function retryOnError(err) {
  if (retries > MAX_RETRIES) {
    console.error('connection error:', err);
    process.exit(1);
  } else {
    console.warn('connection error:', err);
    retries++;
    setTimeout(connect, WAIT_BEFORE_RETRY);
  }
});

mongoose.connection.once('open', function () {
  // we're connected!
  retries = 0;
});

module.exports = mongoose;
