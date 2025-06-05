import { MessageFlags } from 'discord.js';

export async function modalInteraction(interaction) {
    if (interaction.customId === 'editModal') {
        const name = interaction.fields.getTextInputValue('nameInput');
        const folder = interaction.fields.getTextInputValue('folderInput');
        console.log(`name ${name} folder ${folder}`);
        await interaction.reply({ content: `Set name ${name} folder ${folder}`, flags: MessageFlags.Ephemeral });
    }
}
