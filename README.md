# school-system

-このシステムはMVCを用いた簡易なスクール管理システムです。
デプロイ先はHerokuを利用、以下urlで確認頂けます。
https://lit-bayou-40533.herokuapp.com/


-システム :  フレームワークExpress(Node.js) 
-データベース: MongoDB

#　機能概要

-登録・編集・削除機能は,　コース/生徒/先生 テーブルに実装

-DBのスキーマーにmongoose
-ログイン認証機能にpassport.js
-チャット機能はsocket.ioを使用

引き続き、コースデータと生徒データのjoin連動を実装していく予定です。

