/* eslint-disable @typescript-eslint/member-ordering */
import { CONFIG, STORAGE } from "../globals";
import { Event } from "../interfaces/index";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

export const event: Event = {
    name: "ready",
    run: async (client) => {
        console.log(`${client.user?.tag} is online!`);
        console.log(STORAGE);

        if (!client.application?.owner) await client.application?.fetch();


        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const commands = client.slashCommands.map(({ run, devonly, ...data }) => data);


        try {
            await client.application?.commands.set(commands);

        } catch (error) {
            console.log(`There was an error registering a slash command \n${error}`);
        }
        console.log(commands);

        const rest = new REST({ version: "9" }).setToken(CONFIG.token);
        const clientID = client.application?.id;
        if (clientID === undefined) {
            throw new Error("There was an error getting the client ID");
        }


        await (async (): Promise<void> => {
            try {
                console.log("Started refreshing application (/) commands");

                await rest.put(
                    Routes.applicationCommands(clientID),
                    { body: commands }
                );

                console.log("Sucessfully reloaded application (/) commands.");
            } catch (error) {
                console.error(error);
            }
        })();

    }
};