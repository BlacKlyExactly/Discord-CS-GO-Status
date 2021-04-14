import { Client, ClientOptions, Message } from "discord.js";
import { Command, Event } from "../utils/models";
import commands from "./commands";
import events from "./events";

import { 
    token,
    prefix
} from "./config";

class DiscordBot {
    public client: Client;

    constructor( options?: ClientOptions ){
        this.client = new Client(options);
        this.login();
        
        this.client.on("message", ( msg: Message ) => {
            const [ tag ] = msg.content.split(" ");
            commands.forEach(( cmd: Command ) => tag === `${prefix}${cmd.trigger}` && cmd.function(msg));
        })

        events.forEach(({ name, func }: Event ) => {
            this.client.on(name, func);
        })
    }

    private login = ( ) => this.client.login(token);
}

export default DiscordBot;
