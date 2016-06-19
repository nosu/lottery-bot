'use strict';
const app        = require('express')();
const bodyParser = require('body-parser');
const request    = require('request');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const SESSION_EXPIRE = 20000; // 20 seconds
const BASE_URI = "https://trialbot-api.line.me";
const SEND_URI = BASE_URI + '/v1/events';
let session = {};

app.post('/callback', (req, res) => {
  const body = req.body;
  body.result.forEach((msg) => {
    if(!session[msg.content.from]) {
      // if the session doesn't exist
      const content = msg.content;
      const persons = content.split('\n');
      console.log('req.body: ', body);
      console.log('content: ', content);
      if(persons.length >= 2) {
        addSessionTimer(msg.content.from, sessionExpire);
        const newMsg = persons.reduce((prev, cur) => { return prev + cur + "さん, "}, "") + "から何人選びますか？";
        sendMessage({
          to: msg.content.from,
          toChannel: 1383378250, // Fixed value
          eventType: "138311608800106203", // Fixed value
          content: newMsg,
        });
      } else {
        const newMsg = "1人だけじゃ抽選できないよ！";
        sendMessage({
          to: msg.content.from,
          toChannel: 1383378250, // Fixed value
          eventType: "138311608800106203", // Fixed value
          content: newMsg,
        });
      }
      res.send('OK');
    } else {
      // if the session exists
      res.send('OK');
    }
});

const addSessionTimer = (id, expire) => {
  session[id] = true;
  setTimeout(() => { delete session[id]; }, expire);
}

const sendMessage = (content) => {
  return new Promise((resolve, reject) => {
    request({
      uri: SEND_URI,
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "X-Line-ChannelID": process.env.LINE_CHANNEL_ID,
        "X-Line-ChannelSecret": process.env.LINE_CHANNEL_SECRET,
        "X-Line-Trusted-User-With-ACL": process.env.LINE_CHANNEL_MID,
      },
      body: content,
    }, (err, res, body) => {
      if(err) {
        reject(new Error(err));
      }
      resolve(body);
    });
  });
};

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

