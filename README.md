# Discord CS:GO Status

## Description
Discord bot written in typescript, has been made for create nice looking message embeds which inform about cs go servers you set in command

## Configuration
1. Clone or download this repo
2. Inside root folder install dependencies:
```shell
npm install //or
yarn install
```
3. Install **ts-node** for serve and/or **nodemon** for development:
```shell
//npm
npm install nodemon -g
npm install ts-node -g
```
```shell
//yarn
yarn global add nodemon
yarn global add ts-node
```
3. Edit ```src/discrod/config.ts``` and change it for your token and chat trigger prefix:
```ts
export const token = "YOUR TOKEN FROM DISCORD DEV PORTAL";
export const prefix = "csgo_"
```
4. Run bot

Production:
```shell
yarn start
npm run start
```
Development:
```shell
yarn dev
npm run dev
```

## Commands

### setserver
```
csgo_setserver <IP> <Port> <Server Shortname> <Server gamemode> <Game tracker banner id> <Description>
```

- Every argument shouldn't have any **spaces** you can use spaces only in **description** (last argument)
- For Gametracker BannerId visit: https://www.gametracker.com/server_info/YOUR_IP:YOUR_PORT/b/ look for banner you want to use and change button under your banner on **Website/Blog** and coppy code like in the screenshot:
![screen](https://i.imgur.com/7RdEPic.png)
In this example Gt Banner code is **b_560_95_1**

example:
```
csgo_setserver 91.224.117.26 27090 Csowicze-->Jailbreak Jailbreak b_560_95_1 Best jb server
```


### removeserver
```
csgo_removeserver <channel mention> <ip> <port>
```
- Every argument shouldn't have any **spaces** 

example:
```
csgo_removeserver #main 145.239.236.252 27146
```
