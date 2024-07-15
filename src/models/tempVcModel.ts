import {
    Schema,
    model
} from 'mongoose'

interface Tvc {
    voiceChannel: String,
    userId: String,
    guildId: String
}

const tempVcModel = new Schema<Tvc>({
    guildId: String,
    voiceChannel: String,
    userId: String
})  

export default model<Tvc>("tempVcModel", tempVcModel)