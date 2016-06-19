FROM node:6.2.0

RUN useradd --user-group --create-home --shell /bin/false app &&\
  npm install --global npm@3.9.6

ENV HOME=/home/app

COPY package.json $HOME/bot/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/bot
RUN npm install

USER root
COPY . $HOME/bot
RUN chown -R app:app $HOME/*
USER app

CMD ["node", "app.js"]
