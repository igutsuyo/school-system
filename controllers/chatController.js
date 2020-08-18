"use strict";

const Message = require("../models/message");

module.exports = io => {
    //新しいユーザー接続の監視
    io.on("connection", client => {
        Message.find({})
            .sort({
                createdAt: -1
            })
            //新しい10個のメッセージ
            .limit(10)
            .then(messages => {
                client.emit("load all messages", messages.reverse());
            });

        console.log("new connection");
        //そのユーザーの接続断を監視
        client.on("disconnect", () => {
            console.log("user disconnected");
        });
        //メッセージイベントを監視
        client.on("message", data => {
            let messageAttributes = {
                content: data.content,
                userName: data.userName,
                user: data.userId
            },
                //新しいメッセージオブジェクトを作る
                m = new Message(messageAttributes);
            m.save()
                .then(() => {
                    //全ユーザーにブロードキャスト
                    io.emit("message", messageAttributes);
                })
                .catch(error => console.log(`error: ${error.message}`));
        });
    });
};