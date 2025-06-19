import { MessageFlags } from 'discord.js';
import { Bookmark } from '../database/models/index.js';

export async function modalHandler(interaction) {
    switch (interaction.customId) {
    case 'nameModal': {
        const name = interaction.fields.getTextInputValue('nameInput');
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
