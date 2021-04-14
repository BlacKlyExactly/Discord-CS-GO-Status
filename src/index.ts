import Bot from "./discord";
const Discord = require("discord.js");

export const bot: Bot = new Bot(new Discord.Intents(Discord.Intents.ALL));
export default bot;