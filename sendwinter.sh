curl -v -X POST https://api.line.me/v2/bot/message/broadcast \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer OOSkLWjq5NISpH6wjCflkT/9pAyqR0qAZBrzVASDdLO+zeDKQk53AqJ68J7TKQViqw3M2xefrwdh1qd59KRKIHxnu510NTUvXehTucUzxL8EzLF+UBjjosFw0xppUzSyVW6Umucm0yfIaSh3mXGz0wdB04t89/1O/w1cDnyilFU=' \
-d '{
  "messages": [
    {
      "type": "flex",
      "altText": "This is a Flex Message",
      "contents": {
        "type": "bubble",
        "size": "giga",
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "image",
              "size": "full",
              "aspectMode": "cover",
              "aspectRatio": "1:1",
              "gravity": "center",
              "url": "https://www.tabirai.net/sightseeing/column/img/0005343/kiji1Img.jpg?uid=20230321104712"
            },
            {
              "type": "box",
              "layout": "vertical",
              "contents": [],
              "position": "absolute",
              "background": {
                "type": "linearGradient",
                "angle": "0deg",
                "endColor": "#00000000",
                "startColor": "#00000099"
              },
              "width": "100%",
              "height": "40%",
              "offsetBottom": "0px",
              "offsetStart": "0px",
              "offsetEnd": "0px"
            },
            {
              "type": "box",
              "layout": "horizontal",
              "contents": [
                {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "box",
                      "layout": "horizontal",
                      "contents": [
                        {
                          "type": "text",
                          "size": "xl",
                          "color": "#ffffff",
                          "text": "はこだて冬花火"
                        }
                      ]
                    },
                    {
                      "type": "box",
                      "layout": "horizontal",
                      "contents": [
                        {
                          "type": "box",
                          "layout": "baseline",
                          "contents": [
                            {
                              "type": "text",
                              "text": "2月",
                              "color": "#ffffff",
                              "size": "md",
                              "flex": 0,
                              "align": "end"
                            },
                            {
                              "type": "text",
                              "text": "Feb",
                              "color": "#a9a9a9",
                              "decoration": "none",
                              "size": "sm",
                              "align": "end"
                            }
                          ],
                          "flex": 0,
                          "spacing": "lg"
                        }
                      ]
                    }
                  ],
                  "spacing": "xs"
                }
              ],
              "position": "absolute",
              "offsetBottom": "0px",
              "offsetStart": "0px",
              "offsetEnd": "0px",
              "paddingAll": "20px"
            }
          ],
          "paddingAll": "0px"
        }
      }
    }
  ]
}'