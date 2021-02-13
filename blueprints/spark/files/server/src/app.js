'use strict';

const path = require('path');
const express = require('express');

const env = process.env.NODE_ENV || 'development';
const allowTests = env === 'development';
const clientDir = path.join(__dirname, '..', '..');
const distDir = path.join(clientDir, 'dist');
const app = express();

// Serve everything from dist except index.html (implicitly)
app.use('/', express.static(distDir, { index: false }));

// Add tests route if allowed (dev and alpha)
if (allowTests) {
  app.use(
    '/tests',
    express.static(path.join(distDir, 'tests'), { index: false })
  );
  app.use('/tests/*', async function (req, res) {
    res.sendFile(path.join(distDir, 'tests', 'index.html'));
  });
}

// Proxy to ember for history api
app.get('/*', function (req, res) {
  res.sendFile(path.join(distDir, 'index.html'));
});

module.exports = app;
