'use strict';

const server = require('./app');
const port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log(
    'Server listening on port %s in %s.',
    port,
    process.env.NODE_ENV || 'development'
  );
});
