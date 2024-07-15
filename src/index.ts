import {
Client,
} from 'discord.js'

import { CommandKit } from 'commandkit'
import  { loadEvents } from './utils/handlers/loadEvents'
import { connect } from 'mongoose'
import path from 'node:path'


const client = new Client({
    intents: ["Guilds", "GuildMessages", "MessageContent", "GuildVoiceStates", "GuildMembers"]
})


loadEvents(client)



new CommandKit({
    client,
    commandsPath: path.join(__dirname, 'commands')
})

connect("mongodb+srv://Syst:xoderz@xoderz.cz4cjej.mongodb.net/?retryWrites=true&w=majority").then((c) => console.log("MongoDB Is Connected")).catch((e) => console.dir(e))

client.login("MTE4NTI2NDk2OTI1MjYxNDIwNA.GFeJNp._bcrNz6cXB5PeBZBAMU66K4Zi01ai04pqiovP0")

