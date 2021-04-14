import { Channel, Message } from "discord.js";
import { Command } from "../../utils/models";
import { formatChannelMention, removeFromDatabase } from "../../utils/functions";

const removeserver: Command = {
    trigger: "removeserver",
    function: async ( msg: Message ) => {
        if(!msg.member?.hasPermission("ADMINISTRATOR") || !msg.guild) return;
        
        const [ cmd, channel, ip, port ] = msg.content.split(" ");

        if(!ip || !port || !channel){
            msg.reply(`**Użycie:** ${cmd} **<Mention kanału> <IP Servera> <Port serwera>**`);
            return;
        }

        const formatedChannel = formatChannelMention(channel);

        if(!msg.guild.channels.cache.find(( chan: Channel ) => chan.id === formatedChannel)){
            msg.reply("Podany kanał nie istnieje.");
            return;
        }

        removeFromDatabase(formatedChannel, ip, parseInt(port));
    }
}

export default removeserver;