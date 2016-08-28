var mongoose = require('mongoose');
mongoose.Promise = Promise;

function connect() {
  console.log("MONGOSE CONTENT DB PORT: "+ process.env.content_db_PORT);
  return mongoose.connect(`mongodb://localhost:${process.env.content_db_PORT}/local`);
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
