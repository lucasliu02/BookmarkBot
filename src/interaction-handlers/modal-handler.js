import { MessageFlags } from 'discord.js';
import { Bookmark } from '../database/models/index.js';

export async function modalHandler(interaction) {
    switch (interaction.customId) {
    case 'nameModal': {
        const name = interaction.fields.getTextInputValue('nameInput');
        if (name.indexOf('*') > -1) {
            await interaction.update({
                content: 'Invalid character "*"', // TODO: maybe restrict other markdown characters?
                components: interaction.components.components,
                flags: MessageFlags.Ephemeral,
            });
            break;
        }
        const bookmark = await Bookmark.findOne({ where: { discordSnowflake: interaction.user.id, messageId: interaction.message.reference.messageId } });
        bookmark.update({ name: name });
        await interaction.update({
            content: `Bookmark ${name} saved under ${bookmark.folder}${bookmark.link}`,
            components: interaction.components.components,
            flags: MessageFlags.Ephemeral,
        });
        break;
    }
    }
}
