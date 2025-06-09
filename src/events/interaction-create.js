import { Events, MessageFlags } from 'discord.js';
import { buttonHandler } from '../components/button-handler.js';
import { modalHandler } from '../components/modal-handler.js';

export const event = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand() || interaction.isMessageContextMenuCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            try {
                // run the command's execute() method
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
                }
            }
        } else if (interaction.isButton()) {
            buttonHandler(interaction);
        } else if (interaction.isModalSubmit()) {
            modalHandler(interaction);
        }
    },
};