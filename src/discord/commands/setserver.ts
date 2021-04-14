import { Message, MessageEmbed } from "discord.js";
import { Command, Server, Stats } from "../../utils/models";
import { saveToDatabase, getStatsFromDatabase } from "../../utils/functions";

const setserver: Command = {
    trigger: "setserver",
    function: async ( msg: Message ) => {
        if(!msg.member?.hasPermission("ADMINISTRATOR") || !msg.guild) return;
        
        const args = msg.content.split(" ");
        const [ cmd, ip, port, shortName, mode, gtId ] = args;

        const description = args.splice(6).join(" ");

        if(!ip || !port || !shortName || !mode || !description || !gtId){
            msg.reply(`**Użycie:** ${cmd} **<IP Servera> <Port serwera> <Krótka nazwa serwera> <Mod servera> <ID Gt> <Opis servera>**`);
            return;
        }

        const statsFromFile = await getStatsFromDatabase(msg.guild.id);

        const embed = new MessageEmbed()
            .setTitle("Don't delete")
            .setColor("#eb4034");

        const botMsg = await msg.channel.send(embed);

        const server: Server = {
            "channelId": botMsg.channel.id,
            "messageId": botMsg.id,
            "ip": ip,
            "port": parseInt(port),
            "shortName": shortName,
            "serverMode": mode,
            "serverDescription": description,
            "gtId": gtId
        }

        const servers = statsFromFile ? [
            ...statsFromFile?.servers,
            server
        ] : [
            server
        ]

        const stats: Stats = {
            "guildId": msg.guild.id,
            "servers": servers,
        }

        saveToDatabase(stats);
    }
}

export default setserver;