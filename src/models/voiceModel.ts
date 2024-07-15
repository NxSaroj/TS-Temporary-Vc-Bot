import {
Schema, model
} from 'mongoose'

interface Voice {
    voiceChannelId: String,
    textChannelId: String,
    guildId: String,
    messageId: String
}

const voiceModel = new Schema<Voice>({
    voiceChannelId: String,
    textChannelId: String,
    guildId: String,
    messageId: String
})

export default model<Voice>("voiceModel", voiceModel)