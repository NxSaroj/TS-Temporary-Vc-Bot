import type { Role, StringSelectMenuInteraction,  Client } from "discord.js";
import { EventData } from "../../utils/interface/eventIClass";

import tempVcModel from "../../models/tempVcModel";

export const event: EventData = {
  once: false,
  run: async (client:Client, interaction: StringSelectMenuInteraction) => {
    if (!interaction.inCachedGuild()) return
    if (!interaction.isStringSelectMenu()) return;
    if (!(interaction.customId == "text-voice-menu")) return;
    switch (interaction.values[0]) {
      case "lock-unlock-channel":
        if (!interaction.member.voice.channel)
          return await interaction.reply({
            content: "You need to be in a temp voice channel.",
            ephemeral: true,
          });

        const voiceObject = await tempVcModel.findOne(
            { voiceChannel: interaction.member?.voice?.channel?.id },
            { userId: interaction.user.id }
        );

        if (!voiceObject)
          return await interaction.reply({
            content:
              "You cant manage this voice channel as you have not created this",
            ephemeral: true,
          });
          if (interaction.member.voice.channel.permissionsFor(interaction.guild.roles.everyone).has("Connect"))  {
            await interaction.member.voice.channel.permissionOverwrites.create(
                interaction.channel?.guild.roles.everyone as Role,
                { Connect: false }
              )
              interaction.reply({ content: "The Voice Channel Is Locked", ephemeral: true })
          } else  {
            await interaction.member.voice.channel.permissionOverwrites.create(
                interaction.channel?.guild.roles.everyone as Role,
                { Connect: true }
              );
              interaction.reply({ content: "The Voice Channel Has Been Unlocked", ephemeral: true })
          }
        
        break;
    }
  },
};
