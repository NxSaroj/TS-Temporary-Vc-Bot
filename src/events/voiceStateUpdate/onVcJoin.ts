import {
    EventData
} from '../../utils/interface/eventIClass'

import {
    ChannelType,
    type Client,
    type VoiceState
} from 'discord.js'

import tempVcModel from '../../models/tempVcModel'
import voiceModel from '../../models/voiceModel'

export const event:EventData = {
    once: false,
    run: async (client:Client, oldState:VoiceState, newState:VoiceState) => {
               if (!newState.member) return
               if (!newState.guild) return
          const isModuleEnabled =  await voiceModel.findOne(
                { guildId: newState.guild.id }, 
            )

        if (newState.channel?.id == isModuleEnabled?.voiceChannelId) {
            const channel =   await newState.guild.channels.create({
                name: `${newState.member.displayName.toLowerCase()}-channel`,
                type: ChannelType.GuildVoice
            })
            await newState.setChannel(channel.id).catch((e) => console.dir(e))
            await tempVcModel.create(
                { guildId: newState.guild.id, userId: newState.member.id, voiceChannel: channel.id }
            ).catch((e) => console.dir(e))
        } 
    } 
}