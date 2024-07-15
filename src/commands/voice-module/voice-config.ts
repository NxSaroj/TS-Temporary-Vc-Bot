import { type SlashCommandProps } from "commandkit";
import {
  ChannelType,
  ComponentType,
  EmbedBuilder,
  type RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";

import manageVcRow from "../../utils/components/select-menu/vc_config_menu";

import voiceConfigRow from "../../utils/components/select-menu/voice_config_menu";
import voiceModel from "../../models/voiceModel";

export const data: RESTPostAPIApplicationCommandsJSONBody = {
  name: "voice-config",
  description: "Manage the voice module for the guild",
  dm_permission: false,
};

export const run = async ({ interaction, client }: SlashCommandProps) => {
  if (!interaction.inCachedGuild()) return;
  if (!interaction.memberPermissions.has("ManageGuild"))
    return await interaction.reply({
      content: "You need `ManageGuild` permission to execute this command",
      ephemeral: true,
    });
  if (!interaction.guild.members?.me?.permissions.has("Administrator"))
    return await interaction.reply({
      content: "You need `Administrator` permission to execute this command",
      ephemeral: true,
    });
  const isModuleEnabled = await voiceModel.findOne({
    guildId: interaction.guildId,
  });

  const response = await interaction.reply({
    embeds: [
      new EmbedBuilder({
        author: {
          name: client.user.username,
          icon_url: client.user.displayAvatarURL(),
        },
        fields: [
          {
            name: "Enabled",
            value: isModuleEnabled ? "✅" : "❌",
            inline: true,
          },
          {
            name: "Configuration Channel",
            value: isModuleEnabled
              ? `${await interaction.guild.channels.fetch(
                  isModuleEnabled.textChannelId as string
                )}`
              : ":x:",
          },
          {
            name: "Voice Channel",
            value: isModuleEnabled
              ? `${await interaction.guild.channels.fetch(
                  isModuleEnabled?.voiceChannelId as string
                )}`
              : ":x:",
          },
        ],
        color: 0xffffff,
        footer: {
          text: `Requsted by ${interaction.user.username}`,
          icon_url: interaction.user.displayAvatarURL(),
        },
      }),
    ],
    components: [voiceConfigRow],
    fetchReply: true,
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
              const textChannel = await interaction.guild.channels.fetch(
                isModuleEnabled.textChannelId as string
              );
              if (!textChannel?.isTextBased())
                return i.reply({
                  content: "Internal Server Error, Try again later",
                  ephemeral: true,
                });
              const textMessage = textChannel.messages.fetch(
                isModuleEnabled.messageId as string
              );
              if (textMessage) (await textMessage).delete();

              await voiceModel
                .deleteMany({ guildId: interaction.guild.id })
                .catch((err) =>
                  i.reply({
                    content: "DB Error, Try Again Later",
                    ephemeral: true,
                  })
                );
              response.embeds[0].fields[0].value = ":x:";
              response.embeds[0].fields[1].value = ":x:";
              response.embeds[0].fields[2].value = ":x:";
              await response.edit({ embeds: [response.embeds[0]] });
              await i.reply({
                content: "The Join To Create Module Has Been Reset",
                ephemeral: true,
              });
              return;
            } catch (error) {
              console.dir(error);
              return;
            }
          } else {
            await i.deferReply({ ephemeral: true });
            const channelsToAdd = [
              { name: "join-to-create", type: ChannelType.GuildVoice },
              { name: "manage-temporary-vc", type: ChannelType.GuildText },
            ];

            const channels: any = await Promise.all(
              channelsToAdd.map((v) => {
                return interaction.guild.channels.create({
                  type: v.type,
                  name: v.name,
                });
              })
            ).catch((e) => {
              return i.editReply(
                "I dont have enough permissions to create the channel"
              );
            });

            if (!channels[1].isTextBased()) return;
            const message = await channels[1].send({
              content: "You can customize Your temporary voice channel here!",
              components: [manageVcRow],
              fetchReply: true,
            });
            await voiceModel
              .create({
                textChannelId: channels[1].id,
                voiceChannelId: channels[0].id,
                guildId: interaction.guild.id,
                messageId: message.id,
              })
              .catch((e) => i.editReply("DB Error, Try again later"));
            response.embeds[0].fields[0].value = "✅";
            response.embeds[0].fields[1].value = "✅";
            response.embeds[0].fields[2].value = "✅";
            await response.edit({ embeds: [response.embeds[0]] });
            await i.editReply(
              `Manage Your Temp Vc with ${channels[1]} & ${channels[0]}`
            );
          }
          break;
      }
    });
};
