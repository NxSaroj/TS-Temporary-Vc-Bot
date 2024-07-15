import { type SlashCommandProps } from "commandkit";
import {
  ChannelType,
  ComponentType,
  EmbedBuilder,
  type RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";

import manageVcRow from '../../utils/components/select-menu/vc_config_menu'

import voiceConfigRow from "../../utils/components/select-menu/voice_config_menu";
import voiceModel from "../../models/voiceModel";

export const data: RESTPostAPIApplicationCommandsJSONBody = {
  name: "voice-config",
  description: "Manage the voice module for the guild",
  dm_permission: false,
};

export const run = async ({ interaction }: SlashCommandProps) => {
  if (!interaction.inCachedGuild()) return;

  const response = await interaction.reply({
    embeds: [new EmbedBuilder({ description: "Enable Or Disable The Voice Module" })],
    components: [voiceConfigRow],
  });

  response
    .createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      filter: (i) => i.user.id == interaction.user.id,
      time: 600000,
    })
    .on("collect", async (i) => {
      switch (i.values[0]) {
        case "manage-voice-module":
          const isModuleEnabled = await voiceModel.findOne({
            guildId: i.guild.id,
          });
          if (isModuleEnabled) {

            try {
              const textChannel = await interaction.guild.channels.fetch(isModuleEnabled.textChannelId as string)
              if (!textChannel?.isTextBased()) return i.reply({ content: "Internal Server Error, Try again later", ephemeral: true }) 
              const textMessage = textChannel.messages.fetch(isModuleEnabled.messageId as string)
              if (textMessage) (await textMessage).delete()
  
              await voiceModel
                .deleteMany({ guildId: interaction.guild.id })
                .catch((err) =>
                  i.reply({
                    content: "DB Error, Try Again Later",
                    ephemeral: true,
                  })
                );
              return await i.reply({
                content: "The Join To Create Module Has Been Reset",
                ephemeral: true,
              });
            } catch (error) {
              console.dir(error)
              return;
            }
            
          } else {
            await i.deferReply({ ephemeral: true })
            const channelsToAdd = [
              { name: "join-to-create", type: ChannelType.GuildVoice },
              { name: "manage-temporary-vc", type: ChannelType.GuildText },
            ];

            const channels:any = await Promise.all(
              channelsToAdd.map((v) => {
                return interaction.guild.channels
                  .create({
                    type: v.type,
                    name: v.name,
                  })
              })
            ).catch((e) =>
                 {
                   return i.editReply(
                    "I dont have enough permissions to create the channel"
                  )
                 }
              );

              if (!channels[1].isTextBased()) return
              const message = await channels[1].send({ content: "Manage Your Voice Channel Below", components: [manageVcRow], fetchReply: true })
                await voiceModel.create({
                  textChannelId: channels[1].id, 
                  voiceChannelId: channels[0].id, 
                  guildId: interaction.guild.id,
                  messageId: message.id
                }).catch((e) => i.editReply("DB Error, Try again later"))
         
                await i.editReply(`Manage Your Temp Vc with ${channels[1]} & ${channels[0]}`)
              }
          break;
      }
    });
};
