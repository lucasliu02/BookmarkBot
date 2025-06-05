import { ContextMenuCommandBuilder, ApplicationCommandType, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export const command = {
    data: new ContextMenuCommandBuilder()
        .setName('Bookmark')
        .setType(ApplicationCommandType.Message),
        
    async execute(interaction){
        const name = new ButtonBuilder()
            .setCustomId('name')
            .setLabel('Name')
            .setStyle(ButtonStyle.Secondary);
        
        const folder = new ButtonBuilder()
            .setCustomId('folder')
            .setLabel('Folder')
            .setStyle(ButtonStyle.Secondary);
            
        const row = new ActionRowBuilder()
            .addComponents(name, folder);
        
        const message = await interaction.targetMessage;
        console.log(`save ${message.url}`);
        await interaction.reply({
            content: message.url + ' bookmarked!',
            components: [row],
            flags: MessageFlags.Ephemeral
        });
    }
}
