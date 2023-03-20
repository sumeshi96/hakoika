import express, { text } from "express";
import * as line from "@line/bot-sdk";
import fs from "fs";

const config = {
    channelAccessToken:
        process.env.LINE_ACCESS_TOKEN ||
        "OOSkLWjq5NISpH6wjCflkT/9pAyqR0qAZBrzVASDdLO+zeDKQk53AqJ68J7TKQViqw3M2xefrwdh1qd59KRKIHxnu510NTUvXehTucUzxL8EzLF+UBjjosFw0xppUzSyVW6Umucm0yfIaSh3mXGz0wdB04t89/1O/w1cDnyilFU=",
    channelSecret: process.env.LINE_SECRET || "9fa57070f4316c817c718b1a0a4d1d86",
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
        case "postback":
            return await postbackEvent(event);
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

const postbackEvent = async (event: any) => {
    switch (event.postback.data) {
        // カテゴリごと、場所ごとのFlex Messageを表示させる
        case "food_goryokaku":
            //ここでFlex Messageを返す
            return client.replyMessage(event.postback.replyToken, {
                type: "text",
                text:"food_goryokaku"
            });
        case "food_hakodateyama":
            const json:line.Message = fs.readFileSync("./Calu/food_hakodateyama.json","utf-8")
            return client.replyMessage(event.postback.replyToken,json);
        case "food_bayarea":
            return;
        case "food_yunokawa":
            return;   
        case "spot_goryokaku":
            return;
        case "spot_hakodateyama":
            return;
        case "spot_bayarea":
            return;
        case "spot_yunokawa":
            return;
        case "omiyage_goryokaku":
            return;
        case "omiyage_hakodateyama":
            return;
        case "omiyage_bayarea":
            return;
        case "omiyage_yunokawa":
            return;
        
        //行き先リストに追加
        case /addList./:
            const flexId = (event.postback.data).slice(-1);
            return updateSpotData(1, flexId, event);
        
        // 行き先リストを表示する
        case "list":
            return readSpotData(1);
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

// なんとなく書いておく行き先保存用関数
const storeSpotData = () => {
    const spotData= new Array(5);
    for (let i = 0; i < 5; i++) { 
        spotData[i] = new Array(40);
    }

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 40; j++) {
            spotData[i][j] = 0;
        }
    }
    fs.writeFileSync("./src/storeSpotDate.json", JSON.stringify(spotData));
}

// リストに追加
const updateSpotData = (userId:number,flexId:number ,event:any) => {
    const spotData = JSON.parse(fs.readFileSync("./src/storeSpotDate.json", "utf-8"));
    // 1の要素が12個以上あるときは追加できなくする
    let count = 0;
        for (let j = 0; j < 40; j++) {
            if (spotData[userId][j] == 1) {
                count++;
            }
            if (count >= 12) {
                console.log("追加できないよ！")
                return client.replyMessage(event.replyToken, {
                    type: "text",
                    text: "これ以上追加することは出来ません！"
                });
                
                //return;
            }
        }
    spotData[userId][flexId] = 1;
    fs.writeFileSync("./src/storeSpotDate.json", JSON.stringify(spotData));
}

// リストのデータを表示
const readSpotData = (userId:number) => {
    const spotData = JSON.parse(fs.readFileSync("./src/storeSpotDate.json", "utf-8"));
    console.log(spotData[userId]);
}

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
