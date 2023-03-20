import fs from "fs";

/*
egg    : egg.json    を読み込んだもの
bubble : bubble.json を読み込んだもの

*/

// JSONをローカルから取得して返す
//const getLocalJson = (path) => {
//    return JSON.stringify(fs.readFileSync("./src/egg.json", "utf-8"));
//};

//　上の関数を使ってegg.jsonを変数eggに代入
let egg:any =fs.readFileSync("./src/egg.json", 'utf-8');
if (egg.charCodeAt(0) === 0xFEFF) {
    egg = egg.substring(1);
}
const json = JSON.parse(egg);
console.log(json.data[0])

for (let x = 0; x<32; x++) {
    const img:string = json.data[x].img;
    const facility:string = json.data[x].facility;
    const openTime:string = json.data[x].openTime;
    const discription:string = json.data[x].discription;
    const url:string = json.data[x].url;
    const bubble = {
        "type": "bubble",
        "hero": {
            "type": "image",
            "size": "full",
            "aspectRatio": "20:13",
            "aspectMode": "cover",
            "url": img,
        },
        "body": {
            "type": "box",
            "layout": "vertical",
            "spacing": "sm",
            "contents": [
                {
                    "type": "text",
                    "text": facility,
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
                            "text": openTime,
                            "wrap": true,
                            "weight": "bold",
                            "size": "lg",
                            "flex": 0
                        },
                        {
                            "type": "text",
                            "gravity": "bottom",
                            "text": discription,
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
                        "uri": url
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
    let strBubble = JSON.stringify(bubble);
    fs.writeFileSync(`./src/Flex/flex${x+1}.json`,strBubble);
}
console.log("開始")
console.log(egg[0]);
console.log("終了")