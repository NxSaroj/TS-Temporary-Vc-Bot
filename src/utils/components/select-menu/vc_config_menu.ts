import {
    ActionRowBuilder,
  
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
  } from "discord.js";
  
  const menus = [
    {
      label: "Lock-Unlock",
      description: "Lock or Unlock Your VC",
      custom_id: "lock-unlock-channel",
    },
    {
      label: "Limit Channel",
      description: "Add Limits to the channel",
      custom_id: "limit-channel-members",
    },
  ];
  
  const menu = new StringSelectMenuBuilder()
   .setCustomId("text-voice-menu")
   .setPlaceholder("Select an option");
  
  menus.forEach((m) => {
    menu.addOptions([
      new StringSelectMenuOptionBuilder()
      .setValue(m.custom_id)
       .setLabel(m.label?? "nul")
       .setDescription(m.description),
    ]);
  });
  
  export default new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);