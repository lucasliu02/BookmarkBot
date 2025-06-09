import { ActionRowBuilder, MessageFlags, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { getFolders } from '../../database/database.js';
import User from '../../database/User.js';

// temp
// const folders = [];
// if (folders.length === 0) {
//     folders.push('folder1');
//     folders.push('folder2');
//     folders.push('folder3');
// }

// export const command = {
//     data: new SlashCommandBuilder()
//         .setName('bookmark')
//         .setDescription('Bookmark a message')
//         .addStringOption(option =>
//             option.setName('name')
//                 .setDescription('Bookmark name'))
//         .addStringOption(option =>
//             option.setName('folder')
//                 .setDescription('Bookmark folder')
//                 .setAutocomplete(true)),
//     async autocomplete(interaction) {
//         const focusedValue = interaction.options.getFocused();
//         const choices = folders;
//         const filtered = choices.filter(choice => choice.startsWith(focusedValue));
//         await interaction.respond(
//             filtered.map(choice => ({ name: choice, value: choice })),
//         );
//     },
//     async execute(interaction) {
//         const name = interaction.options.getString('name') ?? '';
//         const folder = interaction.options.getString('folder') ?? '';
//         await interaction.reply({ content: `bookmark name ${name} folder ${folder}` });
//     },
// };

export const command = {
    data: new SlashCommandBuilder()
        .setName('bookmark')
        .setDescription('Bookmark a message')
        .addStringOption(option =>
            option.setName('link')
                .setDescription('Bookmark message link')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Bookmark name'))
        .addStringOption(option =>
            option.setName('folder')
                .setDescription('Bookmark folder')
                .addChoices(getFolders())),
    async execute(interaction) {
        const link = interaction.options.getString('link');
        const name = interaction.options.getString('name') ?? '';
        const folder = interaction.options.getString('folder') ?? '';

        let isLink;
        try {
            // if input is valid link, set isLink true
            isLink = new URL(link);
            isLink = true;
        } catch {
            // invalid link throws error, catch and set isLink false
            isLink = false;
        }
        if (!isLink) {
            await interaction.reply({ content: '\u26A0 Bookmark link must be a valid URL \u26A0', flags: MessageFlags.Ephemeral });
            return;
        }

        console.log(interaction);

        let user = await User.findOne({ where: { discordSnowflake: interaction.user.id } });
        if (!user) {
            user = await new User({ discordSnowflake: interaction.user.id }).save();
        }

        await interaction.reply({ content: `implement save bookmark ${link} with name ${name} under folder ${folder}`, flags: MessageFlags.Ephemeral });

        // ! modal implementation - remove?
        // const bookmarkModal = new ModalBuilder()
        //     .setCustomId('bookmarkModal')
        //     .setTitle('Manage Bookmark');

        // const linkInput = new TextInputBuilder()
        //     .setCustomId('linkInput')
        //     .setLabel('Bookmark Message Link')
        //     .setMaxLength(100)
        //     .setStyle(TextInputStyle.Short);

        // const nameInput = new TextInputBuilder()
        //     .setCustomId('nameInput')
        //     .setLabel('Bookmark Name:')
        //     .setMaxLength(100)
        //     .setStyle(TextInputStyle.Short)
        //     .setRequired(false);

        // const firstActionRow = new ActionRowBuilder().addComponents(linkInput);
        // const secondActionRow = new ActionRowBuilder().addComponents(nameInput);
        // bookmarkModal.addComponents(firstActionRow, secondActionRow);
        // await interaction.showModal(bookmarkModal);
        // ! modal implementation - remove?
    },
};
