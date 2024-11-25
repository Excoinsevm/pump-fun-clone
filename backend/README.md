
## system

1. GET /sol-price

```
{
  "solPrice": 256.8
}
```

2. GET /trades/latest

```json
{
  "signature": "2JB8pEuvf2Hg7QhDEtoB64PXjnhmNCB3WSMjakSTAM9NtLxQwmG23XXSqLMiK3bgnSgZ7F3ea8YPSLN44NT9Ys8C",
  "mint": "AmmTmmyhTdNYNnKDWQEW6gCkcmGR1gVpAdmdc1hRpump",
  "sol_amount": 10000000,
  "token_amount": 123136883713,
  "is_buy": false,
  "user": "GdLKiZVtA1SwWGyTmWXSp4JbrRPaxAQF98hJJ1dDxXUZ",
  "timestamp": 1732365750,
  "symbol": "205g",
  "image_uri": "https://ipfs.io/ipfs/QmbbhU8UdkfSBgWwE8qnWhZ9DE5Pa7PtpsTeQanvvyfrph",
  "slot": 303134519
}
```

3. GET /coins/latest

```json
{
  "mint": "u91UHMN5DHkh8XpcocejKbn4k1p5U4NRymNLN5vpump",
  "name": "arts/ai",
  "symbol": "arts/ai",
  "description": "Redefining modern day art by applying artificial intelligence ",
  "image_uri": "https://ipfs.io/ipfs/QmaHo3Ymhj9gjP5CButKzNZUVKCGwukLPtvpJxB3xYaNWe",
  "metadata_uri": "https://ipfs.io/ipfs/QmUMSP9nMiJZYUktbLbDcFFnVjnVPVVDSwpSkRgHnsvdRx",
  "twitter": "https://x.com/artaionsol",
  "telegram": "https://t.me/+FgnOcYqxSRNkMGFk",
  "bonding_curve": "85BNHJDiaEiUfqdwPHTRuc8Agwc8GYRWdNZQtdAT9nNd",
  "associated_bonding_curve": "Cb3z4k8exNWDUYENWJVZFKj9tmNuCjjFSmBSbCuTELt1",
  "creator": "3DHVJSZQopVUd4jfno2nGvEYZWwEQKX6bm1i8XMWEjFd",
  "created_timestamp": 1732365750540,
  "raydium_pool": null,
  "complete": false,
  "virtual_sol_reserves": 33100000000,
  "virtual_token_reserves": 972507552871391,
  "hidden": null,
  "total_supply": 1000000000000000,
  "website": "https://www.artai.today/",
  "show_name": true,
  "last_trade_timestamp": 1732365750000,
  "king_of_the_hill_timestamp": null,
  "market_cap": 34.03572538,
  "nsfw": false,
  "market_id": null,
  "inverted": null,
  "real_sol_reserves": 3100000000,
  "real_token_reserves": 692607552871391,
  "livestream_ban_expiry": 0,
  "last_reply": null,
  "reply_count": 0,
  "is_banned": false,
  "is_currently_live": false,
  "initialized": true,
  "video_uri": null
}
```

## auth

1. POST /auth/login

```json

{
  "address": "4nVcciUWQK3hyyFMQQkZE6vic3Mf9R736U7MpgxyV3N9",
  "signature": "3Gv7Bd8kxKchLqnRW6feWUxTw1b7LBN4tioVxune5FAuAbSfo1qpWeLZbQ44PdVYeouzUjceWAGsfCFQNbM9CF6w",
  "timestamp": 1732365425728
}
```

return

```json
{
  "address": "4nVcciUWQK3hyyFMQQkZE6vic3Mf9R736U7MpgxyV3N9",
  "roles": [
    "user"
  ],
  "group": "test",
  "iat": 1732365435,
  "exp": 1734957435
}
```

2. GET /auth/my-profile

```json
{
  "address": "4nVcciUWQK3hyyFMQQkZE6vic3Mf9R736U7MpgxyV3N9",
  "roles": [
    "user"
  ],
  "group": "test",
  "iat": 1732365435,
  "exp": 1734957435
}
```

3. GET /user/<:username>, GET /user/<:address>

```json
{
  "address": "4nVcciUWQK3hyyFMQQkZE6vic3Mf9R736U7MpgxyV3N9",
  "likes_received": 0,
  "unread_notifs_count": 0,
  "mentions_received": 0,
  "followers": 4,
  "following": 0,
  "username": "qiwihui",
  "profile_image": null,
  "last_username_update_timestamp": 0,
  "bio": ""
}
```

4. get /balances/<:address>?limit=50&offset=0&minBalance=0.001

```json
[
  {
    "address": "4nVcciUWQK3hyyFMQQkZE6vic3Mf9R736U7MpgxyV3N9",
    "mint": "GNKqp4iuvUmEZoNh254bfTKFVfh1rGZyx1brHiG9pump",
    "balance": 217046707290,
    "image_uri": "https://cf-ipfs.com/ipfs/QmWdq6WDVhADDEQyBfha7ZmkSAJzcfXuCCU2ioEnC3txLF",
    "symbol": "DRPEPE",
    "name": "Dr PEPE",
    "market_cap": 28.040404679,
    "value": 0.00608607750665606
  },
  {
    "address": "4nVcciUWQK3hyyFMQQkZE6vic3Mf9R736U7MpgxyV3N9",
    "mint": "D73tCapuN1ySvpScM38oLHHJQHky68wVbXzky4hkpump",
    "balance": 174568586945,
    "image_uri": "https://cf-ipfs.com/ipfs/QmZR8YRayUHJ15NiGwyJX7YswwE9JoEWFYjcDZiXSPDAKM",
    "symbol": "SOUL",
    "name": "Soulana by Matt Furie",
    "market_cap": 29.588859043,
    "value": 0.005165285312451295
  }
]
```

5. /coins/user-created-coins/<:address>?offset=0&limit=10&includeNsfw=false

```json
```

## token

1. upload png file

curl <https://api-v2.sunpump.meme/pump-api/file/upload>

response:

```json
{"code":0,"msg":"SUCCESS","data":"public/temp/TZ5LzV_D0xPzyvs0ZeO.png"}
```

POST /api/ipfs

```shell
file: (binary)
name: asd
symbol: asd
description: asd
twitter: 
telegram: 
website: 
showName: true
video: 

```

```json
{
  "metadata": {
    "name": "asd",
    "symbol": "asd",
    "description": "asd",
    "image": "https://ipfs.io/ipfs/QmP3HUREo4RtyWMiFVz9KZU4rbpjQ59PfnWu1BCycW5Eza",
    "showName": true,
    "createdOn": "https://pump.fun"
  },
  "metadataUri": "https://ipfs.io/ipfs/QmY9doyCiRZPudR69xEb9WWRY5RurbVi7CduFL8VX3vrhe"
}
```


2. create token

```shell
curl 'https://api-v2.sunpump.meme/pump-api/token' \
  --data-raw '{"symbol":"asdasd","ownerAddress":"TZ5LzVz9CkY1Jm8UV3gRkgFWbAa9y41J2V","name":"asdasd","description":"asdasd","logoFileKey":"public/temp/TZ5LzV_O8dosa0WYxqF.png","websiteUrl":"https://google.com","telegramUrl":"asdasd","twitterUrl":"asdasd"}'
```

```json
{
  "captchaToken": "",
  "vanityKeyCaptchaToken": "",
  "name": "asd",
  "ticker": "asd",
  "description": "asd",
  "twitter": "",
  "telegram": "",
  "website": "",
  "showName": true,
  "image": "https://ipfs.io/ipfs/QmP3HUREo4RtyWMiFVz9KZU4rbpjQ59PfnWu1BCycW5Eza"
}
```

response:

```shell
{
    "code": 0,
    "msg": "SUCCESS",
    "data": {
        "id": 232003,
        "symbol": "asdasd",
        "ownerAddress": "TZ5LzVz9CkY1Jm8UV3gRkgFWbAa9y41J2V",
        "contractAddress": null,
        "swapPoolAddress": null,
        "name": "asdasd",
        "description": "asdasd",
        "logoUrl": "https://cdn.sunpump.meme/public/logo/asdasd_TZ5LzV_O8dosa0WYxqF.png",
        "decimals": 18,
        "twitterUrl": "asdasd",
        "telegramUrl": "asdasd",
        "websiteUrl": "https://google.com",
        "status": "UPLOADED",
        "active": true,
        "syncToTronScan": false,
        "syncToTronScanDatetime": null,
        "totalSupply": 1000000000,
        "currentSold": 0,
        "createTxHash": null,
        "tokenCreatedInstant": null,
        "launchTxHash": null,
        "priceInTrx": null,
        "tokenLaunchedInstant": null,
        "firstReachHillInstant": null,
        "trxReserve": null,
        "tokenReserve": 0,
        "pumpPercentage": 0.0,
        "trxPriceInUsd": null,
        "listOn": null,
        "holders": 0
    }
}
```

3. search token

```shell
curl 'https://api-v2.sunpump.meme/pump-api/token/search?page=1&size=24&sort=tokenCreatedInstant:DESC'
```

supported `sort`: `marketCap:DESC`, `priceChange24Hr:DESC`, `tokenCreatedInstant:DESC`, `volume24Hr:DESC`

response:

```json
{
    "code": 0,
    "msg": "SUCCESS",
    "data": {
        "tokens": [
            {
                "id": 232002,
                "symbol": "EM",
                "ownerAddress": "TMxV343gpPgpFDASSjVKDL3Bc7Aq3G4uFh",
                "contractAddress": "TKrr49KutbVQQHjERSVAXJLNcLTyroSNCD",
                "swapPoolAddress": null,
                "name": "Elon",
                "description": "To the moon....",
                "logoUrl": "https://cdn.sunpump.meme/public/logo/EM_TMxV34_DtLq5kfvM2TN.jpeg",
                "decimals": 18,
                "twitterUrl": "",
                "telegramUrl": "",
                "websiteUrl": "",
                "status": "CREATED",
                "active": true,
                "syncToTronScan": false,
                "syncToTronScanDatetime": null,
                "totalSupply": 1000000000,
                "currentSold": 0,
                "createTxHash": "6545f5e3be328f81d2d6547af74f60fec51d5ee06dab8675e050dfa302eab331",
                "tokenCreatedInstant": 1732032162.000000000,
                "launchTxHash": null,
                "priceInTrx": 0.0000349723538691700,
                "tokenLaunchedInstant": null,
                "firstReachHillInstant": null,
                "trxReserve": 1189.98,
                "tokenReserve": 764816819.46,
                "marketCap": 7066.6500000000000000000,
                "virtualLiquidity": 14625.3800000000000000000,
                "volume24Hr": 1189.9800000000000000000,
                "priceChange24Hr": 6.1800000000000000000,
                "pumpPercentage": 1.0,
                "trxPriceInUsd": null,
                "listOn": null,
                "holders": 0
            },
        ],
        "metadata": {
            "page": 1,
            "size": 24,
            "total": 0,
            "sort": "tokenCreatedInstant:DESC"
        }
    }
}
```


4. get token detail

```shell
curl 'https://api-v2.sunpump.meme/pump-api/token/TXL6rJbvmjD46zeN1JssfgxvSo99qC8MRT'
```

`TXL6rJbvmjD46zeN1JssfgxvSo99qC8MRT` is token contractAddress

response:

```json
{"code":0,"msg":"SUCCESS","data":{"id":829,"symbol":"SUNDOG","ownerAddress":"TXr7ifGXHzAerNz2go11eJQ5R2QwcRJkAf","contractAddress":"TXL6rJbvmjD46zeN1JssfgxvSo99qC8MRT","swapPoolAddress":"TDR7rpU33hToG8qo9i676V56bzcjkpjqox","name":"Sundog","description":"SUNDOG: The Dog on TRON taking us to the Sun","logoUrl":"https://cdn.sunpump.meme/public/logo/SUNDOG_TXr7if_EzxfYukzq9ZU.png","decimals":18,"twitterUrl":"https://x.com/SUNDOG_TRX","telegramUrl":"https://t.me/SUNDOG_TRX","websiteUrl":"https://www.sundog.meme/","status":"LAUNCHED","active":true,"syncToTronScan":true,"syncToTronScanDatetime":1723761474166,"totalSupply":1000000000,"currentSold":0,"createTxHash":"0177939db732884b59fff573bb96d5b8d1232993c32f4e1effa0d85a2c46e241","tokenCreatedInstant":1723761237.000000000,"launchTxHash":"f9c1baf04a7c2ab704aafc280dc03fc108a7c75a8aaf640a1ae3df44e0c372ff","priceInTrx":0.9669744738859590420,"tokenLaunchedInstant":1723762428.000000000,"firstReachHillInstant":null,"trxReserve":0.00,"tokenReserve":0.00,"marketCap":195112197.37,"virtualLiquidity":0.00,"volume24Hr":8829074.274527,"priceChange24Hr":-10.57,"pumpPercentage":100.0,"trxPriceInUsd":0.201775954420618846,"stakeAddress":"TRnQvRaKaRhjLEW6zwD1WX64kWCj2Yyu43","stakeApy":0E-8,"listOn":{"HTX":"https://www.htx.com/trade/sundog_usdt/","Poloniex":"https://poloniex.com/trade/SUNDOG_USDT","MEXC":"https://www.mexc.com/exchange/SUNDOG_USDT?_from=market","Bybit":"https://www.bybit.com/en/trade/spot/SUNDOG/USDT","Gate":"https://www.gate.io/trade/SUNDOG_USDT","Kucoin":"https://www.kucoin.com/price/SUNDOG","Bitget":"https://www.bitget.com/spot/SUNDOGUSDT","OKex":"","Binance":"","AscendEX":"","BitMart":""},"holders":0}}
```

5. get token comments

```shell
curl 'https://api-v2.sunpump.meme/pump-api/comments/TXL6rJbvmjD46zeN1JssfgxvSo99qC8MRT?page=1&size=100&nano=' \
```

response:

```json
{
    "code": 0,
    "msg": "SUCCESS",
    "data": {
        "comments": [
            {
                "id": "1833453823898837629",
                "contractAddress": "TXL6rJbvmjD46zeN1JssfgxvSo99qC8MRT",
                "userAddress": "TBxddL8bFRT1s2AT1Ruj1E8eMwXhBcgnj1",
                "dateTime": "2024-11-18T12:44:06.355Z",
                "nano": 1731933846355355,
                "message": "follow me on twitter!!! This will start once I get 100 followers!\nhttps://x.com/kimsuki_sol"
            },
            {
                "id": "1833453823898181057",
                "contractAddress": "TXL6rJbvmjD46zeN1JssfgxvSo99qC8MRT",
                "userAddress": "TFeejri8j5cjGnowQ6vi74Q63QCAqdtnQt",
                "dateTime": "2024-11-17T17:10:41.717Z",
                "nano": 1731863441717717,
                "message": "A little off-topic question: My okx wallet stores 556 USDT and I have a seed. (hip hover obey rare ladder office cage slender room world denial vivid). Can you tell me how to send them to Binance?"
            }
        ]
    }
}
```

6. get token holders

```shell
curl 'https://api-v2.sunpump.meme/pump-api/token/holdersV2?page=1&size=10&address=TDYLdYQ9k596rV1ytKbbM4Eo4pVPFaXR6p'
```

response:

```json
{
    "code": 0,
    "msg": "SUCCESS",
    "data": {
        "symbol": null,
        "holders": [
            {
                "address": "TTfvyrAz86hbZk5iDpKD78pqLGgi8C7AAw",
                "balance": 973567341.99,
                "priceInTrx": null,
                "valueInTrx": null,
                "percentage": 97.356734199,
                "holderType": "BOUNDING_CURVE"
            },
            {
                "address": "TEfMJK2ND96HtJ88AAEKoSpgXqkLBmwR5Z",
                "balance": 11970844.16,
                "priceInTrx": null,
                "valueInTrx": null,
                "percentage": 1.197084416,
                "holderType": "CREATOR"
            },
            {
                "address": "TCnxnLy9QWzncKk35KxsFatJX5fqpCMAQU",
                "balance": 11644029.75,
                "priceInTrx": null,
                "valueInTrx": null,
                "percentage": 1.164402975,
                "holderType": "NORMAL_USER"
            },
            {
                "address": "TUV3iFsbsrJSMGBa93YErjLbNDviuSWZXH",
                "balance": 2762383.92,
                "priceInTrx": null,
                "valueInTrx": null,
                "percentage": 0.276238392,
                "holderType": "NORMAL_USER"
            },
            {
                "address": "TBoG2mKE7YJmc7YFywsvRChbEvb71Wfzm7",
                "balance": 27700.84,
                "priceInTrx": null,
                "valueInTrx": null,
                "percentage": 0.002770084,
                "holderType": "NORMAL_USER"
            },
            {
                "address": "TU9xE4KC86xRHFbHferSwPxwPbkXhcveLg",
                "balance": 27699.34,
                "priceInTrx": null,
                "valueInTrx": null,
                "percentage": 0.002769934,
                "holderType": "NORMAL_USER"
            }
        ],
        "metadata": {
            "page": 1,
            "size": 10,
            "total": 6,
            "sort": ""
        },
        "rangeTotal": 6
    }
}
```


7. get token transaction history


```shell
curl 'https://api-v2.sunpump.meme/pump-api/transactions/token/TV9Xpvyoa6BpBPmKfc1uUFaF1vdqqToSzf?page=1&size=10&sort=txDateTime:DESC'
```

response:

```json
{
    "code": 0,
    "msg": "SUCCESS",
    "data": {
        "swaps": [
            {
                "id": null,
                "tranType": null,
                "txnOrderType": "BUY",
                "userAddress": "TEfMJK2ND96HtJ88AAEKoSpgXqkLBmwR5Z",
                "tokenAddress": "TV9Xpvyoa6BpBPmKfc1uUFaF1vdqqToSzf",
                "swapPoolAddress": "virtualPool",
                "fromTokenAddress": "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb",
                "toTokenAddress": "TV9Xpvyoa6BpBPmKfc1uUFaF1vdqqToSzf",
                "fromTokenSymbol": "TRX",
                "toTokenSymbol": "SBunny",
                "fromTokenAmount": 19.800000,
                "toTokenAmount": 575459.516065231338568351,
                "fee": 0.200000,
                "volumeInUsd": null,
                "txHash": "f630f6199074c849d44ffe36481d63e943a3988fd876be7cead8bb9f4f8e303d",
                "uniqueId": "f630f6199074c849d44ffe36481d63e943a3988fd876be7cead8bb9f4f8e303d_2",
                "blockNum": 67127837,
                "txDateTime": 1732033308000
            },
            {
                "id": null,
                "tranType": null,
                "txnOrderType": "BUY",
                "userAddress": "TCnxnLy9QWzncKk35KxsFatJX5fqpCMAQU",
                "tokenAddress": "TV9Xpvyoa6BpBPmKfc1uUFaF1vdqqToSzf",
                "swapPoolAddress": "virtualPool",
                "fromTokenAddress": "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb",
                "toTokenAddress": "TV9Xpvyoa6BpBPmKfc1uUFaF1vdqqToSzf",
                "fromTokenSymbol": "TRX",
                "toTokenSymbol": "SBunny",
                "fromTokenAmount": 396.000000,
                "toTokenAmount": 11644029.748085327224045331,
                "fee": 4.000000,
                "volumeInUsd": null,
                "txHash": "9bdfd3233e9f0cb4409d8b76145303ffd6b09b12c0055e2c279c2f01b7a20faa",
                "uniqueId": "9bdfd3233e9f0cb4409d8b76145303ffd6b09b12c0055e2c279c2f01b7a20faa_2",
                "blockNum": 67127794,
                "txDateTime": 1732033179000
            }
        ],
        "metadata": {
            "page": 1,
            "size": 10,
            "total": 10,
            "sort": "txDateTime:DESC"
        }
    }
}
```
