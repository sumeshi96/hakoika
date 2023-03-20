import express from "express";
import * as line from "@line/bot-sdk";
import fs from "fs";

const config = {
    channelAccessToken:
        process.env.LINE_ACCESS_TOKEN ||
        "Cma/vukavLctdYahgGGLVPglo0zlhV3xs0A5wd+du9ra4oSW+/IuFtBGUApxuHbUnGcrkSjdhQOzdY4TTCI1Mv6d3RNAuZ/iCSjbYaqjSlLOah8PaO5Q9u5zc6XGPrkboAFhBXKP/tcwbBDIPKzzRQdB04t89/1O/w1cDnyilFU=",
    channelSecret: process.env.LINE_SECRET || "b8664e402e76291440564818f7ccea48",
};

const port = process.env.PORT || 3000;
const app = express();

// ヘルスチェック用エンドポイント
app.get("/webhook", (req: express.Request, res: express.Response) => {
    res.sendStatus(200);
});

// bot用エンドポイント
app.post("/webhook", line.middleware(config), (req: express.Request, res: express.Response) => {
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

// フォローされたときのイベント
// メッセージとリッチメニューを表示
const followEvent = async (event: any) => {
    try {
        await client.replyMessage(event.replyToken, {
            type: "text",
            text: "Thank you following!!",
        });
        await richMenuEvent(
            await getLocalJson("./exampleData/exRichMenu.json"),
            getLocalImage("./exampleData/img.png")
        );
    } catch (err) {
        console.log(err);
    }
};

// JSONをローカルから取得して返す
const getLocalJson = async (path: string): Promise<line.RichMenu> => {
    return JSON.parse(fs.readFileSync(`${path}`, "utf-8"));
};

// イメージをローカルから取得して返す
const getLocalImage = (path: string): fs.ReadStream => {
    return fs.createReadStream(`${path}`);
};

// リッチメニューを呼び出してセットする
const richMenuEvent = async (richMenu: line.RichMenu, image: fs.ReadStream) => {
    try {
        const richMenuId = await client.createRichMenu(richMenu);
        await client.setRichMenuImage(richMenuId, image);
        await client.setDefaultRichMenu(richMenuId);
    } catch (err) {
        throw err;
    }
};

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
