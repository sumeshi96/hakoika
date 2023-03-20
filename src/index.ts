import express from "express";
import * as line from "@line/bot-sdk";
import fs from "fs";

const config = {
    channelAccessToken: "",
    channelSecret: "",
};

const port = process.env.PORT || 3000;
const app = express();

//ヘルスチェック用エンドポイント
app.get("/webhook", (req: express.Request, res: express.Response) => {
    res.sendStatus(200);
});

app.get("/webhook", (req: express.Request, res: express.Response) => {
    Promise.all(req.body.events.map(handleEvent)).then((result) => {
        res.json(result);
    });
});

const client = new line.Client(config);

// webhookイベントの処理
const handleEvent = async (event: any): Promise<any> => {
    switch (event.type) {
        case "follow":
            return await followEvent(event);
        case "unfollow":
            // エラー回避
            return;
        case "message":
            return;
        default:
            return;
    }
};

const followEvent = async (event: any) => {
    try {
        await client.replyMessage(event.replyToken, {
            type: "text",
            text: "Thank you following!!",
        });
    } catch (err) {
        console.log(err);
    }
};

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
