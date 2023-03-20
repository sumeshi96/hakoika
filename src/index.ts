import express, { text } from "express";
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
    try {
        switch (event.postback.data) {
            // カテゴリごと、場所ごとのFlex Messageを表示させる
            case "food_goryokaku":
                //ここでFlex Messageを返す
                let json1 = JSON.parse(fs.readFileSync("./src/Cell/food_goryokaku.json", "utf-8"));
                return client.replyMessage(event.postback.replyToken, json1);
            case "food_hakodateyama":
                let json2 = JSON.parse(fs.readFileSync("./src/Cell/food_hakodateyama.json", "utf-8"));
                return client.replyMessage(event.postback.replyToken, json2);
            case "food_bayarea":
                let json3 = JSON.parse(fs.readFileSync("./src/Cell/food_bayarea.json", "utf-8"));
                return client.replyMessage(event.postback.replyToken, json3);
            // yeah
            case "food_yunokawa":
                let json4 = JSON.parse(fs.readFileSync("./src/Cell/food_yunokawa.json", "utf-8"));
                return client.replyMessage(event.replyToken, {
                    "type": "flex",
                    "altText": "food_yunokawa",
                    "contents":{
                        "type": "carousel",
                        "contents": [
                            {
                                "type": "bubble",
                                "hero": {
                                    "type": "image",
                                    "size": "full",
                                    "aspectRatio": "20:13",
                                    "aspectMode": "cover",
                                    "url": "https://www.hasesuto.co.jp/images/stores/yunokawa-pc.jpg"
                                },
                                "body": {
                                    "type": "box",
                                    "layout": "vertical",
                                    "spacing": "sm",
                                    "contents": [
                                        {
                                            "type": "text",
                                            "text": "ハセガワストア湯の川店",
                                            "wrap": true,
                                            "weight": "bold",
                                            "size": "xl"
                                        },
                                        {
                                            "type": "box",
                                            "layout": "vertical",
                                            "contents": [
                                                {
                                                    "type": "text",
                                                    "text": "0:00-24:00",
                                                    "wrap": true,
                                                    "weight": "bold",
                                                    "size": "lg",
                                                    "flex": 0
                                                },
                                                {
                                                    "type": "text",
                                                    "gravity": "bottom",
                                                    "text": "地元のスーパーマーケット。地元の食材やお土産が豊富。",
                                                    "decoration": "none",
                                                    "wrap": true
                                                }
                                            ]
                                        }
                                    ]
                                },
                                "footer": {
                                    "type": "box",
                                    "layout": "vertical",
                                    "spacing": "sm",
                                    "contents": [
                                        {
                                            "type": "button",
                                            "style": "primary",
                                            "action": {
                                                "type": "uri",
                                                "label": "Check om Map",
                                                "uri": "https://goo.gl/maps/8c2ux6PsMWMM19Jv5"
                                            },
                                            "color": "#80abcf",
                                            "gravity": "top"
                                        },
                                        {
                                            "type": "button",
                                            "action": {
                                                "type": "postback",
                                                "data": "hello",
                                                "label": "Add to To do list"
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }).catch((err) => { console.log(err.originalError.response.data.details); });
            case "spot_goryokaku":
                let json5 = JSON.parse(fs.readFileSync("./src/Cell/spot_goryokaku.json", "utf-8"));
                return client.replyMessage(event.postback.replyToken, json5);
            case "spot_hakodateyama":
                let json6 = JSON.parse(fs.readFileSync("./src/Cell/spot_hakodateyama.json", "utf-8"));
                return client.replyMessage(event.postback.replyToken, json6);
            case "spot_bayarea":
                let json7 = JSON.parse(fs.readFileSync("./src/Cell/spot_bayarea.json", "utf-8"));
                return client.replyMessage(event.postback.replyToken, json7);
            case "spot_yunokawa":
                let json8 = JSON.parse(fs.readFileSync("./src/Cell/spot_yunokawa.json", "utf-8"));
                return client.replyMessage(event.postback.replyToken, json8);
            case "omiyage_goryokaku":
                let json9 = JSON.parse(fs.readFileSync("./src/Cell/omiyage_goryokaku.json", "utf-8"));
                return client.replyMessage(event.postback.replyToken, json9);
            case "omiyage_hakodateyama":
                let json10 = JSON.parse(fs.readFileSync("./src/Cell/omiyage_hakodateyama.json", "utf-8"));
                return client.replyMessage(event.postback.replyToken, json10);
            // yeah
            case "omiyage_bayarea":let json11 = JSON.parse(fs.readFileSync("./src/Cell/food_yunokawa.json", "utf-8"));
            return client.replyMessage(event.replyToken, {
                "type": "flex",
                "altText": "omiyage_bayarea",
                "contents":{
                    "type": "carousel",
                    "contents": [
                        {
                            "type": "carousel",
                            "contents": [
                                {
                                    "type": "bubble",
                                    "hero": {
                                        "type": "image",
                                        "size": "full",
                                        "aspectRatio": "20:13",
                                        "aspectMode": "cover",
                                        "url": "https://s3-media0.fl.yelpcdn.com/bphoto/GL1Df67p95LDxFASDXg6BA/o.jpg"
                                    },
                                    "body": {
                                        "type": "box",
                                        "layout": "vertical",
                                        "spacing": "sm",
                                        "contents": [
                                            {
                                                "type": "text",
                                                "text": "ラオックス函館赤レンガ店",
                                                "wrap": true,
                                                "weight": "bold",
                                                "size": "xl"
                                            },
                                            {
                                                "type": "box",
                                                "layout": "vertical",
                                                "contents": [
                                                    {
                                                        "type": "text",
                                                        "text": "9:30-19:00",
                                                        "wrap": true,
                                                        "weight": "bold",
                                                        "size": "lg",
                                                        "flex": 0
                                                    },
                                                    {
                                                        "type": "text",
                                                        "gravity": "bottom",
                                                        "text": "函館赤レンガ倉庫群内にあるショッピングセンター。",
                                                        "decoration": "none",
                                                        "wrap": true
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    "footer": {
                                        "type": "box",
                                        "layout": "vertical",
                                        "spacing": "sm",
                                        "contents": [
                                            {
                                                "type": "button",
                                                "style": "primary",
                                                "action": {
                                                    "type": "uri",
                                                    "label": "Check om Map",
                                                    "uri": "https://www.google.com/maps/search/%E3%83%A9%E3%82%AA%E3%83%83%E3%82%AF%E3%82%B9%E5%87%BD%E9%A4%A8%E8%B5%A4%E3%83%AC%E3%83%B3%E3%82%AC%E5%BA%97/@41.7664879,140.7143082,17z/data=!3m1!4b1"
                                                },
                                                "color": "#80abcf",
                                                "gravity": "top"
                                            },
                                            {
                                                "type": "button",
                                                "action": {
                                                    "type": "postback",
                                                    "data": "addList14",
                                                    "label": "Add to To do list"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "type": "bubble",
                                    "hero": {
                                        "type": "image",
                                        "size": "full",
                                        "aspectRatio": "20:13",
                                        "aspectMode": "cover",
                                        "url": "https://s3-media0.fl.yelpcdn.com/bphoto/GL1Df67p95LDxFASDXg6BA/o.jpg"
                                    },
                                    "body": {
                                        "type": "box",
                                        "layout": "vertical",
                                        "spacing": "sm",
                                        "contents": [
                                            {
                                                "type": "text",
                                                "text": "北海道四季彩館函館店",
                                                "wrap": true,
                                                "weight": "bold",
                                                "size": "xl"
                                            },
                                            {
                                                "type": "box",
                                                "layout": "vertical",
                                                "contents": [
                                                    {
                                                        "type": "text",
                                                        "text": "7:00-20:00",
                                                        "wrap": true,
                                                        "weight": "bold",
                                                        "size": "lg",
                                                        "flex": 0
                                                    },
                                                    {
                                                        "type": "text",
                                                        "gravity": "bottom",
                                                        "text": "北海道の土産物や特産品が揃う店舗。",
                                                        "decoration": "none",
                                                        "wrap": true
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    "footer": {
                                        "type": "box",
                                        "layout": "vertical",
                                        "spacing": "sm",
                                        "contents": [
                                            {
                                                "type": "button",
                                                "style": "primary",
                                                "action": {
                                                    "type": "uri",
                                                    "label": "Check om Map",
                                                    "uri": "https://goo.gl/maps/Ra7855D12uAYGfWw7"
                                                },
                                                "color": "#80abcf",
                                                "gravity": "top"
                                            },
                                            {
                                                "type": "button",
                                                "action": {
                                                    "type": "postback",
                                                    "data": "addList15",
                                                    "label": "Add to To do list"
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                        
                    ]
                }
            }).catch((err) => { console.log(err.originalError.response.data.details); });
            case "omiyage_yunokawa":
                let json12 = JSON.parse(fs.readFileSync("./src/Cell/omiyage_yunokawa.json", "utf-8"));
                return client.replyMessage(event.postback.replyToken, json12);
        
            //行き先リストに追加
            case /addList./:
                const flexId = (event.postback.data).slice(-1);
                return updateSpotData(1, flexId, event);
        
            // 行き先リストを表示する
            case "list":
                return readSpotData(1);
        }
    } catch (err:any) {
        console.log(err.originalError.response.data.details);
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
