const fs = require("fs");

/*
egg    : egg.json    を読み込んだもの
bubble : bubble.json を読み込んだもの

*/

// JSONをローカルから取得して返す
const getLocalJson = (path) => {
    return JSON.stringify(fs.readFileSync("./src/egg.json", "utf-8"));
};

//　上の関数を使ってegg.jsonを変数eggに代入
const egg = JSON.stringify(fs.readFileSync("./src/egg.json", "utf-8"));

//　上の関数を使ってbubble.jsonを変数bubbleに代入
const bubble = getLocalJson("./src/bubble.json");

//デバッグ　egg.jsonの読み込み
//console.log(egg);

//デバッグ　bubble.jsonの読み込み
//console.log(bubble);

/*
function getLocalJson(path){
    return;
}

const getLocalJson = (path) => {
    return;
}

getLocalJson("egg.json");
*/


for (let x = 0; Object.keys(egg).length; x++) {
    //const img: any = egg[x].img;
    //let facility: string = egg[x].facility;
    //let openTime: string = egg[x].openTime;
    //let discription: string = egg[x].discription;
    //let url: string = egg[x].url;
    /*
    bubble.url = img;
    bubble.body.contents[0].text = facility;
    bubble.body.contents[1].contents[0].text = openTime;
    bubble.body.contents[1].contents[1].text = discription;
    bubble.footer.contents[0].action.uri = url;
    */
    console.log(egg[x].img);
}

console.log(bubble);