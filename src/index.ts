import {
Client,
} from 'discord.js'

import { CommandKit } from 'commandkit'
import  { loadEvents } from './utils/handlers/loadEvents'
import { connect } from 'mongoose'
import path from 'node:path'
import colors from 'colors'
import 'dotenv/config'


const client = new Client({
    intents: ["Guilds", "GuildMessages", "MessageContent", "GuildVoiceStates", "GuildMembers"]
})


loadEvents(client)



new CommandKit({
    client,
    commandsPath: path.join(__dirname, 'commands')
})

connect(process.env.DB_URI).then((c) => console.log(colors.green("MongoDB Connected"))).catch((e) => console.error(e))

client.login(process.env.TOKEN)

