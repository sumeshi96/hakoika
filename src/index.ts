import express from "express";
import * as line from "@line/bot-sdk";
import fs from "fs";

const config = {
    channelAccessToken:
        process.env.LINE_ACCESS_TOKEN ||
        "QWxDTHCEIPeZYRGsCH/F7qWQdOGeQRO7G/3RMNOnNCQ8AbNuVHg/rBn+HzrH46q2nGcrkSjdhQOzdY4TTCI1Mv6d3RNAuZ/iCSjbYaqjSlIMrHAkfCpHVO+8xuuhU4TNIllBNyPWse9WuN59xUrp9gdB04t89/1O/w1cDnyilFU=",
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
        await selectLanguageQuickReply(
            event,
            "追加してくれてありがとう！\n言語を選択してください\n\nThank you following!\nPlease select a language."
        );
        for (let i = 5; i >= 1; i--) {
            const filename = `./src/RichMenu/richMenu${i}.json`;
            console.log(filename);
            await richMenuEvent(
                `rich-menu-${i}`,
                await getLocalJson(filename),
                getLocalImage(`./src/RichMenu/richmenu${i}.jpeg`)
            );
        }
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
const richMenuEvent = async (aliasName: string, richMenu: line.RichMenu, image: fs.ReadStream) => {
    try {
        // リッチメニューを作成する
        const richMenuId = await client.createRichMenu(richMenu);
        console.log(richMenuId);
        // リッチメニュー画像を追加する
        await client.setRichMenuImage(richMenuId, image);
        // 作成したリッチメニューをデフォルトに設定する
        await client.setDefaultRichMenu(richMenuId);
        // リッチメニューにエイリアスに登録する
        await client.createRichMenuAlias(richMenuId, aliasName);
        const richMenuList = await client.getRichMenuAliasList();
        console.log(richMenuList);
    } catch (err: any) {
        //console.log(err);
        console.log(err.originalError.response.data);
        //console.log(err.originalError.response.request);
    }
};

const selectLanguageQuickReply = async (event: any, sendMessage: string) => {
    try {
        await client.replyMessage(event.replyToken, {
            type: "text",
            text: sendMessage,
            quickReply: {
                items: [
                    {
                        type: "action",
                        action: {
                            type: "message",
                            label: "Japanese",
                            text: "Japanese",
                        },
                    },
                    {
                        type: "action",
                        action: {
                            type: "message",
                            label: "English",
                            text: "English",
                        },
                    },
                    {
                        type: "action",
                        action: {
                            type: "message",
                            label: "Chinese",
                            text: "Chinese",
                        },
                    },
                ],
            },
        });
    } catch (err) {
        console.log(err);
    }
};

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
