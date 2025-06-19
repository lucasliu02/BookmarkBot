import { MessageFlags, EmbedBuilder } from 'discord.js';
import { Bookmark } from '../database/models/index.js';

export async function selectMenuHandler(interaction) {
    switch (interaction.customId) {
    case 'folderSet': {
        const folder = interaction.values[0];
        const bookmark = await Bookmark.findOne({ where: { discordSnowflake: interaction.user.id, messageId: interaction.message.reference.messageId } });
        await bookmark.update({ folder: folder });
        console.log(interaction);
        await interaction.update({
            content: `Bookmark **${bookmark.name}** saved under **${folder}**\n${bookmark.link}`,
            components: interaction.message.components,
            flags: MessageFlags.Ephemeral,
        });
        break;
    }
    case 'folderSelect': {
        const folder = interaction.values[0];
        console.log('!!!!!!!!!!!!!!');
        console.log(interaction);
        const bookmarks = await Bookmark.findAll({
            where: {
                discordSnowflake: interaction.user.id,
                folder: folder,
            },
            order: [
                ['name', 'ASC'],
            ],
        });

        const fields = [];
        if (bookmarks.length === 0) {
            fields.push({ name: 'No bookmarks', value: '' });
        } else {
            for (const bookmark of bookmarks) {
                fields.push({ name: bookmark.name, value: bookmark.link, inline: true });
            }
        }

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(interaction.values[0])
            .addFields(fields);

        // await interaction.message.edit({
        await interaction.deferUpdate();
        await interaction.message.edit({
            embeds: [embed],
            components: interaction.message.components,
        });
        break;
    }
    }
}
