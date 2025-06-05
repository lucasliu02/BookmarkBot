import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export async function buttonInteraction(interaction) {
    if (interaction.customId === 'editBtn') {
        const editModal = new ModalBuilder()
            .setCustomId('editModal')
            .setTitle('Edit Bookmark');

        const nameInput = new TextInputBuilder()
            .setCustomId('nameInput')
            .setLabel('Bookmark Name:')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        const folderInput = new TextInputBuilder()
            .setCustomId('folderInput')
            .setLabel('Bookmark Folder:')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        const firstActionRow = new ActionRowBuilder().addComponents(nameInput);
        const secondActionRow = new ActionRowBuilder().addComponents(folderInput);
        editModal.addComponents(firstActionRow, secondActionRow);

        // ensure that only user who triggered interaction can use buttons
        // although shouldn't be necessary b/c ephemeral
        console.log('edit button clicked');
        await interaction.showModal(editModal);
    } else if (interaction.customId === 'undoBtn') {
        console.log('undo utton clicked');
        await interaction.update({ content: `${interaction.targetMessage.url} bookmark deleted`, components: [] });
    }
}