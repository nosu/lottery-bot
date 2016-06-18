FROM node:6.2.0

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app

COPY package.json $HOME/bot/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/bot
RUN npm install

CMD ["node", "app.js"]
