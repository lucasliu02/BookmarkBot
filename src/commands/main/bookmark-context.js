import { ContextMenuCommandBuilder, ApplicationCommandType, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from 'discord.js';
import { Bookmark, Folder, User } from '../../database/models/index.js';
import { getFolderNames } from './manage-folders.js';

export const command = {
    data: new ContextMenuCommandBuilder()
        .setName('Bookmark')
        .setType(ApplicationCommandType.Message),

    async execute(interaction) {
        const nameBtn = new ButtonBuilder()
            .setCustomId('nameBtn')
            .setLabel('Name Bookmark')
            .setStyle(ButtonStyle.Secondary);

        const undoBtn = new ButtonBuilder()
            .setCustomId('undoBtn')
            .setLabel('Undo')
            .setStyle(ButtonStyle.Secondary);

        const message = await interaction.targetMessage;

        // ? are users even needed
        let user = await User.findOne({ where: { discordSnowflake: interaction.user.id } });
        if (!user) {
            user = await new User({ discordSnowflake: interaction.user.id }).save();
            console.log(`saved new user ${interaction.user.id}`);
        }

        let folder = await Folder.findOne({ where: { discordSnowflake: interaction.user.id, folder: 'No folder' } });
        if (!folder) {
            folder = await new Folder({
                discordSnowflake: interaction.user.id,
                folder: 'No folder',
            }).save();
        }
        let bookmark = await Bookmark.findOne({ where: { discordSnowflake: interaction.user.id, messageId: message.id } });
        if (!bookmark) {
            bookmark = await new Bookmark({
                discordSnowflake: interaction.user.id,
                messageId: message.id,
                link: message.url,
                name: '<no name>',
                folder: 'No folder',
            }).save();

            const folderOptions = await getFolderNames(interaction.user.id, 'No folder');

            const folderSet = new StringSelectMenuBuilder()
                .setCustomId('folderSet')
                .setPlaceholder('Change folder')
                .addOptions(folderOptions);

            const row1 = new ActionRowBuilder()
                .addComponents(nameBtn, undoBtn);
            const row2 = new ActionRowBuilder()
                .addComponents(folderSet);

            await interaction.reply({
                content: `Bookmark **<no name>** saved under folder **No folder**\n${message.url}`,
                components: [row1, row2],
                // withResponse: true,
                flags: MessageFlags.Ephemeral,
            });
        } else {
            await interaction.reply({ content: '\u26A0 Bookmark already exists \u26A0', flags: MessageFlags.Ephemeral });
        }
    },
};
