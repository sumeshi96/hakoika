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

const client = new line.Client(config);

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
