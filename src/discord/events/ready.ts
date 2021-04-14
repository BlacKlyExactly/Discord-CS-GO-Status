import { GuildChannel, MessageEmbed, TextChannel } from "discord.js";
import { fetchServerData, getFromDatabase, removeFromDatabase } from "../../utils/functions";
import { Server, Stats } from "../../utils/models";
import { bot } from "../../";

const gtUrl = "https://cache.gametracker.com/server_info";

export default async () => {
    const stats = await getFromDatabase();
    console.log("Cs:Go Stats > Ready");

    stats.forEach(({ servers, guildId }: Stats ) => {
        servers.forEach(({ 
            channelId, 
            ip, 
            port,
            messageId, 
            serverMode, 
            shortName, 
            serverDescription, 
            gtId
        }: Server ) => {
            setInterval(async () => {
                const serverData = await fetchServerData(ip, port);
                const guild = bot.client.guilds.cache.get(guildId);

                //@ts-expect-error
                const channel: TextChannel | undefined = guild?.channels.cache.find(
                    ({ type, id }: GuildChannel ) => type === "text" && id === channelId);
                
                const message = await channel?.messages.fetch (messageId);

                if(!message || !channel){
                    removeFromDatabase(channelId, ip, port);
                    return;
                }

                const embed = new MessageEmbed()
                    .setColor("#6636f5")
                    .setTitle(shortName)
                    .setDescription(serverDescription)
                    .setImage(`${gtUrl}/${ip}:${port}/${gtId}.png`)
                    .addField("Mod Servera", serverMode, true)
                    .addField("Sloty", `${serverData.players.length}/${serverData.maxplayers}`, true)
                    .addField("Mapa", `${serverData.map}`, true)
                    .addField("\u200B", "\u200B")
                    .addField("Połącz się:", `steam://connect/${ip}:${port}`, false)
                    .addField("Zobacz statystyki:", `https://www.gametracker.com/server_info/${ip}:${port}/`, false)
                    .setTimestamp();

                message?.edit(embed);
            }, 60000)
        })
    })
}