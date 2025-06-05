import { Message, MessageFlags, SlashCommandBuilder } from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction){
        await interaction.reply({content: 'Pong!', flags: MessageFlags.Ephemeral});
    },
};

// export default command;