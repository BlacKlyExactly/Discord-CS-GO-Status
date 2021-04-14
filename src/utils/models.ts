import { Message } from "discord.js";

export interface Command {
    trigger: string,
    function: ( msg: Message ) => void
}

export interface Event {
    name: string,
    func: ( ) => void
}

export interface Server {
    channelId: string,
    messageId: string,
    shortName: string,
    serverMode: string,
    serverDescription: string,
    gtId: string
    ip: string,
    port: number
}

export interface Stats {
    guildId: string,
    servers: Server[]
}