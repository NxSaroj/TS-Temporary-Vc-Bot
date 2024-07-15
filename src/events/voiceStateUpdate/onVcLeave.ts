import { EventData } from "../../utils/interface/eventIClass";

import { ChannelType, type Client, type VoiceState } from "discord.js";

import tempVcModel from "../../models/tempVcModel";
import voiceModel from "../../models/voiceModel";

export const event: EventData = {
  once: false,
  run: async (client: Client, oldState: VoiceState, newState: VoiceState) => {
    if (!newState.member) return;
    if (!newState.guild) return;
    const isUserGone = await tempVcModel.findOne({
      guildId: newState.guild.id,
      userId: newState.member.id,
    });

    if (!isUserGone) return;

    try {
      if (
        !newState.channelId ||
        newState.channel?.id !== isUserGone.voiceChannel
      ) {
        const channel = await newState.guild.channels.fetch(
          isUserGone?.voiceChannel as string
        );
        if (channel) await channel.delete();
        await tempVcModel.deleteMany({
          guildId: newState.guild.id,
          userId: newState.member?.id,
        });
      }
    } catch (error) {
      return console.error(error);
    }
  },
};
