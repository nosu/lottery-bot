'use strict';
const express = require('express');
const app = express();

app.post('/callback', (req, res) => {
  console.log('req.body: ', req.body);
  res.send('OK');
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
