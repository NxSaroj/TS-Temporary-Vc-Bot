import type { Client } from "discord.js";
import { getFiles } from "../paths/getFiles";
import colors from "colors";

import path from "node:path";

export function loadEvents(client: Client) {
  const eventFolders = getFiles(path.join(__dirname, "../../events"), true);

  for (const folder of eventFolders) {
    const eventName = path.basename(folder, path.extname(folder));

    const files = getFiles(folder);

    for (const file of files) {
      console.log(file);
      if (!file.endsWith(".ts") && !file.endsWith(".js")) continue;

      const event = require(file).event;

      if (event.once) {
        client.once(eventName, (...args) => event.run(client, ...args));
      } else {
        client.on(eventName, (...args) => event.run(client, ...args));
      }
    }

    console.log(`Loaded event ${eventName}`);
  }
}
