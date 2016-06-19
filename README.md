# ちゅうせんくん for LINE

## 概要
改行区切りで人名を送ると、その中から指定の人数をランダムで選んでくれるLINE Botです。

## 起動方法
1. `$ git clone https://github.com/nosu/lottery-bot.git`
2. `$ cp .env.sample .env && vi .env`
3. `$ docker-compose build`
4. `$ docker-compose up`

※HOST側のポートが30002になっているので、`docker-compose.yml`の`ports`を適宜変更してください

## 使い方
1. BOT宛に、名前を改行区切りで送る（e.g. "山田\n田中\n佐藤"）
2. 人数を聞かれるので、当たりにした人数を半角数字で送る（e.g. "1"）
3. 選ばれた人が返る

## TODO
BOT API Trialがグループをサポートしたら、グループの全員から自動的に選んでくれるようにする。（というか本当はそれがやりたかった）
