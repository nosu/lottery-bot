'use strict';
const app        = require('express')();
const bodyParser = require('body-parser');
const request    = require('request');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const BASE_URI = "https://trialbot-api.line.me";
const SEND_URI = BASE_URI + '/v1/events';

/**
 * The session stores the id who sent the message and the list of the person names.
 * Each session will be deleted automatically SESSION_EXPIRE(ms) later.
 * Example: { ubcf6832fae5a186d9b8ac7261e3ff000: ['John', 'Doe'] }
 */
const SESSION_EXPIRE = 20000; // 20 seconds
let session = {};

app.post('/callback', (req, res) => {
  const body = req.body;
  body.result.forEach((msg) => {
    if(!session[msg.content.from]) {
      // if the session doesn't exist
      console.log('content: ', msg.content);
      const persons = msg.content.text.split('\n').map(p => p.trim());
      if(persons.length >= 2) {
        addSessionWithTimer(msg.content.from, persons, SESSION_EXPIRE);
        const newMsg = `${persons.join("さん, ")}さんから何人選ぶ？数字で教えてー`;
        console.log('sendMessage');
        sendMessage(newMsg, [msg.content.from]);
      } else {
        const newMsg = "1人だけじゃ抽選できないよ！";
        sendMessage(newMsg, [msg.content.from]);
      }
    } else {
      // if the session exists
      console.log('session: ', session);
      const matchResult = msg.content.text.match(/([0-9]+)/);
      const persons = session[msg.content.from];
      if(matchResult) {
        const numberOfWinners = parseInt(matchResult[0]);
        const winners = chooseRandomItems(persons, numberOfWinners);
        const newMsg = `${winners.join("さん, ")}さんが当たりだよ！`;
        sendMessage(newMsg, [msg.content.from]);
      } else {
        const winners = chooseRandomItems(persons, 1);
        const newMsg = `よくわからないから1人だけ選んだ結果…\n${winners[0]}さんが当たりだよ！`;
        sendMessage(newMsg, [msg.content.from]);
      }
      deleteSession(msg.content.from);
    }
  });
  res.send('OK');
});

const addSessionWithTimer = (id, persons, expire) => {
  session[id] = persons;
  setTimeout(deleteSession.bind(null, id), expire);
};

const deleteSession = (id) => {
  console.log(`The session <${id}> is deleted.`);
  delete session[id];
};

const chooseRandomItems = (array, number) => {
  let a = array.concat();
  let r = [];
  let l = array.length;
  let n = Math.min(number, array.length);
  while(n-- > 0) {
    let i = Math.floor(Math.random() * l--);
    r.push(a[i]);
    a.splice(i, 1);
  }
  return r;
};

const sendMessage = (text, toId) => {
  return new Promise((resolve, reject) => {
    const options = {
      uri: SEND_URI,
      method: "POST",
      json: true,
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "X-Line-ChannelID": process.env.LINE_CHANNEL_ID,
        "X-Line-ChannelSecret": process.env.LINE_CHANNEL_SECRET,
        "X-Line-Trusted-User-With-ACL": process.env.LINE_CHANNEL_MID,
      },
      body: {
        to: toId,
        toChannel: 1383378250, // Fixed value
        eventType: "138311608800106203", // Fixed value
        content: {
          contentType: 1,
          toType: 1,
          text: text,
        }
      }
    };
    console.log('options: ', options);
    request(options, (err, res, body) => {
      if(err) {
        reject(new Error(err));
      }
      console.log('request complete without error\nbody: ', body);
      resolve(body);
    });
  });
};

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
