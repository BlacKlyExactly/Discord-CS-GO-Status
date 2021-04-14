import * as gamedig from "gamedig";
import { promises as fs } from "fs";
import * as path from "path";
import { Server, Stats } from "./models";
import { bot } from "../";
import { GuildChannel, MessageEmbed } from "discord.js";

const gtUrl = "https://cache.gametracker.com/server_info";
const projectPath = __dirname + "/.."

export const formatUserMention = ( mention: string ): string => {
    return mention.slice(3).slice(0, -1);
}

export const formatChannelMention = ( mention: string ): string => {
    mention = mention.replace("<#", "").replace(">", "");
    return mention;
}
 
export const fetchServerData = async ( ip: string, port: number ): Promise<gamedig.QueryResult> => {
    return gamedig.query({
        type: "csgo",
        host: ip,
        port: port
    })
}

export const saveToDatabase = async ( object: Stats ) => {
    try {
        let stats = await getFromDatabase();
        const index: number = stats.findIndex(( stat: Stats ) => stat.guildId === object.guildId);
        
        index !== -1 ? stats[index] = object : stats = [ ...stats, object ];
        const data = JSON.stringify(stats, null, 4);

        console.log(stats);

        fs.writeFile(path.normalize(`${projectPath}/database.json`), data);
    } catch (error) {
        console.error(error);
    }
}

export const removeFromDatabase = async ( channelId: string, ip: string, port: number ) => {
    try {
        const stats = await getFromDatabase();
        stats.forEach(( stat: Stats, index: number ) => {
            const filtredStat = stat.servers.filter(( server: Server ) => {
                return (
                    channelId === server.channelId &&
                    ip === server.ip &&
                    port === server.port
                )
            })

            stats[index].servers = filtredStat;
        })
    
        const data = JSON.stringify(stats, null, 4);
        fs.writeFile(path.normalize(`${projectPath}/database.json`), data);
    } catch (error) {
        console.error(error);
    }
}

export const getFromDatabase = async (): Promise<Stats[] | []> => {
    const data = await fs.readFile(path.normalize(`${projectPath}/database.json`));
    const object = JSON.parse(data.toString());

    return object;
}

export const getStatsFromDatabase = async ( guildId: string ): Promise<Stats | undefined> => {
    const stats = await getFromDatabase();
    return stats.find(( stat: Stats ) => stat.guildId === guildId);
}

export const refreshServers = async () => {
    const stats = await getFromDatabase();

    stats.forEach(({ servers, guildId }: Stats ) => {
        servers.forEach(async ({ 
            channelId, 
            ip, 
            port,
            messageId, 
            serverMode, 
            shortName, 
            serverDescription, 
            gtId
        }: Server ) => {
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
        })
    })
}