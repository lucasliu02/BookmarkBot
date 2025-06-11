import { ActionRowBuilder, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } from 'discord.js';
import { Bookmark } from '../database/models/index.js';

export async function buttonHandler(interaction) {
    // if (interaction.customId === 'editBtn') {
    switch (interaction.customId) {
    // case 'editBtn': {
    //     const editModal = new ModalBuilder()
    //         .setCustomId('editModal')
    //         .setTitle('Edit Bookmark');

    //     const nameInput = new TextInputBuilder()
    //         .setCustomId('nameInput')
    //         .setLabel('Bookmark Name:')
    //         .setStyle(TextInputStyle.Short)
    //         .setRequired(false);

    //     const folderInput = new TextInputBuilder()
    //         .setCustomId('folderInput')
    //         .setLabel('Bookmark Folder:')
    //         .setStyle(TextInputStyle.Short)
    //         .setRequired(false);

    //     const firstActionRow = new ActionRowBuilder().addComponents(nameInput);
    //     const secondActionRow = new ActionRowBuilder().addComponents(folderInput);
    //     editModal.addComponents(firstActionRow, secondActionRow);

    //     console.log('edit button clicked');
    //     await interaction.showModal(editModal);
    //     break;
    // }
    // // } else if (interaction.customId === 'undoBtn') {
    // case 'undoBtn':
    //     console.log('undo button clicked');
    //     console.log(interaction.message.content);
    //     await interaction.update({ content: 'undo button clicked', components: [] });
    //     // await interaction.update({ content: `${interaction.targetMessage.url} bookmark deleted`, components: [] });
    //     break;
    case 'confirmBtn': {
        // ! entire process could likely be simplified if bookmark-folder relationship could be fixed?
        // TODO: need to also show empty folders, but might be solved by this ^ ?

        // all bookmarks sorted alphabetically by name
        const bookmarks = await Bookmark.findAll({
            where: { discordSnowflake: interaction.user.id },
            order: [
                ['name', 'ASC'],
            ],
            raw: true,
        });

        // group bookmarks into their folders
        const unsorted = groupJsonBy(bookmarks, 'folder');

        // sort folders alphabetically
        const sorted = Object.keys(unsorted).sort().reduce(
            (obj, key) => {
                obj[key] = unsorted[key];
                return obj;
            },
            {},
        );
        console.log(sorted);

        // TODO: should order messages so no folder is first/last?
        const embedMsgs = [
            new EmbedBuilder()
                .setColor(0x42f545)
                .setTitle('Bookmarks'),
        ];
        for (const folder of Object.keys(sorted)) {
            let title = folder;
            if (folder === 'null') {
                console.log('null folder');
                title = 'No folder';
            }
            const fields = [];
            for (const bookmark of sorted[folder]) {
                fields.push({ name: bookmark.name, value: bookmark.link, inline: true });
            }
            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(title)
                .addFields(fields);
            embedMsgs.push(embed);
        }

        await interaction.update({
            content: interaction.message.content,
            components: [],
            flags: MessageFlags.Ephemeral,
        });
        await interaction.user.send({ embeds: embedMsgs });
        break;
    }
    case 'cancelBtn':
        await interaction.deferUpdate();
        await interaction.deleteReply();
        break;
    }
}

// ? how does this work
/**
 * Groups JSON contents by value of key.
 * @param {JSON} xs - Target JSON object.
 * @param {string} key - JSON key.
 * @returns {JSON} Modified JSON.
 */
function groupJsonBy(xs, key) {
    return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};