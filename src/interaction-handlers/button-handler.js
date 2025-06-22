import { ActionRowBuilder, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, StringSelectMenuBuilder } from 'discord.js';
import { Bookmark, Folder } from '../database/models/index.js';
import { getFolderNames } from '../commands/main/manage-folders.js';

export async function buttonHandler(interaction) {
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
    case 'nameBtn': {
        const nameModal = new ModalBuilder()
            .setCustomId('nameModal')
            .setTitle('Name Bookmark');

        const nameInput = new TextInputBuilder()
            .setCustomId('nameInput')
            .setLabel('Bookmark Name:')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(nameInput);
        nameModal.addComponents(actionRow);
        await interaction.showModal(nameModal);
        // await interaction.update({ content: 'implement namebtn', components: [] });
        break;
    }
    case 'undoBtn':
        await Bookmark.destroy({ where: { discordSnowflake: interaction.user.id, messageId: interaction.message.reference.messageId } });
        await interaction.deferUpdate();
        await interaction.deleteReply();
        break;
    case 'dmConfirmBtn': {
        const bookmarks = await Bookmark.findAll({
            where: {
                discordSnowflake: interaction.user.id,
                folder: 'No folder',
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
            .setTitle('No folder')
            .addFields(fields);

        const folderOptions = await getFolderNames(interaction.user.id, 'No folder');
        const folderSelect = new StringSelectMenuBuilder()
            .setCustomId('folderSelect')
            // .setPlaceholder('No folder')
            .addOptions(folderOptions);
        const row = new ActionRowBuilder()
            .addComponents(folderSelect);
        await interaction.deferUpdate();
        await interaction.deleteReply();
        await interaction.user.send({ embeds: [embed], components: [row] });
        break;
    }
    case 'cancelBtn':
        await interaction.deferUpdate();
        await interaction.deleteReply();
        break;
    case 'deleteFolderBtn': {
        // ! finds folder name by retrieving substring between bold markdown (**)
        // ? is it not possible to retrieve the string option from the original command?
        const folder = interaction.message.content.split('**')[1];
        // ! sequelize doesn't support compound foreign keys?
        // ? > can't set folder as bookmark fk?
        // ? > can't cascade delete bookmarks with folder?
        await Bookmark.destroy({ where: { discordSnowflake: interaction.user.id, folder: folder } });
        await Folder.destroy({ where: { discordSnowflake: interaction.user.id, folder: folder } });
        await interaction.update({
            content: `**${folder}** folder deleted`,
            components: [],
            flags: MessageFlags.Ephemeral,
        });
        break;
    }
    }
}

// ? how does this work
/**
 * Groups JSON contents by value of key.
 * @param {JSON} xs - Target JSON object.
 * @param {string} key - JSON key.
 * @returns {JSON} Modified JSON.
 */
// function groupJsonBy(xs, key) {
//     return xs.reduce(function(rv, x) {
//         (rv[x[key]] = rv[x[key]] || []).push(x);
//         return rv;
//     }, {});
// };

// async function oldDmConfirmBtn(interaction) {
//     // ! entire process could likely be simplified if bookmark-folder relationship could be fixed?
//     // TODO: need to also show empty folders, but might be solved by this ^ ?

//     // all bookmarks sorted alphabetically by name
//     const bookmarks = await Bookmark.findAll({
//         where: { discordSnowflake: interaction.user.id },
//         order: [
//             ['name', 'ASC'],
//         ],
//         raw: true,
//     });

//     // group bookmarks into their folders
//     const unsorted = groupJsonBy(bookmarks, 'folder');

//     // sort folders alphabetically
//     const sorted = Object.keys(unsorted).sort().reduce(
//         (obj, key) => {
//             obj[key] = unsorted[key];
//             return obj;
//         },
//         {},
//     );
//     console.log(sorted);

//     // TODO: should order messages so no folder is first/last?
//     const embedMsgs = [
//         new EmbedBuilder()
//             .setColor(0x42f545)
//             .setTitle('Bookmarks'),
//     ];
//     for (const folder of Object.keys(sorted)) {
//         let title = folder;
//         if (folder === 'null') {
//             console.log('null folder');
//             title = 'No folder';
//         }
//         const fields = [];
//         for (const bookmark of sorted[folder]) {
//             fields.push({ name: bookmark.name, value: bookmark.link, inline: true });
//         }
//         const embed = new EmbedBuilder()
//             .setColor(0x0099FF)
//             .setTitle(title)
//             .addFields(fields);
//         embedMsgs.push(embed);
//     }

//     const folderOptions = getFolderNames(interaction.user.id, 'No folder');
//     const folderSelect = new StringSelectMenuBuilder()
//         .setCustomId('folderSelect')
//         .addOptions(folderOptions);

//     const row = new ActionRowBuilder()
//         .addComponents(folderSelect);

//     await interaction.update({
//         content: interaction.message.content,
//         components: [],
//         flags: MessageFlags.Ephemeral,
//     });
//     await interaction.user.send({ embeds: embedMsgs, components: [row] });
// }