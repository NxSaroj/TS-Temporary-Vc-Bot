import type { Client } from "discord.js";
import { EventData } from "../../utils/interface/eventIClass";
import colors from "colors";
export const event: EventData = {
  once: false,
  run(client: Client, c: Client) {
    console.log(colors.green(c.user?.username + "" + "Is online"));
  },
};
