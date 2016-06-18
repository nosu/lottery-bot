'use strict';
const app        = require('express')();
const bodyParser = require('body-parser');
const request    = require('request');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/callback', (req, res) => {
  const json = req.body;
  console.log('req.body: ', json);
  res.send('OK');
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

