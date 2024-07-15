import {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
} from "discord.js";

export default new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
  new StringSelectMenuBuilder()
    .setCustomId("voice-config-menu")
    .setPlaceholder("Make a selection")
    .addOptions([
      new StringSelectMenuOptionBuilder()
        .setValue("manage-voice-module")
        .setLabel("Manage Module")
        .setDescription("Enable or Disable the module"),

        new StringSelectMenuOptionBuilder()
        .setValue("rest-voice-module")
        .setLabel("Reset Module")
        .setDescription("Reset the module"),
    ])
);
