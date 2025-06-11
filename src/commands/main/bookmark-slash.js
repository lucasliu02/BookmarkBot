import { MessageFlags, SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { Bookmark, User } from '../../database/models/index.js';

export const command = {
    data: new SlashCommandBuilder()
        .setName('bookmark')
        .setDescription('Manage bookmarks')
        .addSubcommand(subcommand =>
            subcommand.setName('add')
                .setDescription('Bookmark a message')
                .addStringOption(option =>
                    option.setName('link')
                        .setDescription('Bookmark message link')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('Bookmark name')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('folder')
                        .setDescription('Bookmark folder')
                        .setAutocomplete(true)))
        .addSubcommand(subcommand =>
            // TODO: change to subcommandgroup?
            subcommand.setName('delete')
                .setDescription('Delete a bookmark')
                .addStringOption(option =>
                    option.setName('link')
                        .setDescription('Bookmark message link'))
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('Bookmark name (ignored if link option is given)')
                        .setAutocomplete(true)))
        .addSubcommand(subcommand =>
            // TODO: change to subcommandgroup and add subcommand to retrieve all bookmarks under folder?
            subcommand.setName('get')
                .setDescription('Retrieve a bookmark by name')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('Bookmark name')
                        .setAutocomplete(true)
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('dm')
                .setDescription('Get a full list of your bookmarks in DMs')),
    async autocomplete(interaction, choices) {
        const focusedValue = interaction.options.getFocused().toUpperCase();
        const filtered = choices.filter(choice => choice.toUpperCase().includes(focusedValue));
        await interaction.respond(filtered.map(choice => ({ name: choice, value: choice })));
    },
    async execute(interaction) {
        const link = interaction.options.getString('link');
        const name = interaction.options.getString('name');
        const folder = interaction.options.getString('folder');

        switch (interaction.options.getSubcommand()) {
        case 'add':
            bookmarkAdd(interaction, link, name, folder);
            break;
        case 'delete':
            bookmarkDelete(interaction, link, name);
            break;
        case 'get':
            bookmarkGet(interaction, name);
            break;
        case 'dm':
            bookmarkDM(interaction);
            break;
        }

        // const subcommand = interaction.options.getSubcommand();
        // if (subcommand === 'add') {
        //     bookmarkAdd(interaction, link, name, folder);
        // } else if (subcommand === 'delete') {
        //     bookmarkDelete(interaction, link, name);
        // } else if (subcommand === 'get') {
        //     bookmarkGet(interaction, name);
        // } else if (subcommand === 'dm') {
        //     bookmarkDM(interaction);
        // }
    },
};

async function bookmarkAdd(interaction, link, name, folder) {
    let isLink;
    try {
        // if input is valid link, set isLink true
        new URL(link);
        isLink = true;
    } catch {
        // invalid link throws error, catch and set isLink false
        isLink = false;
    }
    if (!isLink) {
        await interaction.reply({ content: '\u26A0 Bookmark link must be a valid URL \u26A0', flags: MessageFlags.Ephemeral });
        return;
    }

    let user = await User.findOne({ where: { discordSnowflake: interaction.user.id } });
    if (!user) {
        user = await new User({ discordSnowflake: interaction.user.id }).save();
        console.log(`saved new user ${interaction.user.id}`);
    }

    let bookmark = await Bookmark.findOne({ where: { discordSnowflake: interaction.user.id, link: link } });
    if (!bookmark) {
        bookmark = await new Bookmark({
            discordSnowflake: interaction.user.id,
            link: link,
            name: name,
            folder: folder,
        }).save();
        let replyWithFolder = '';
        if (folder !== '') {
            replyWithFolder = ` under **${folder}** folder`;
        }
        await interaction.reply({ content: `Saved bookmark **${name}**${replyWithFolder}\n${link}`, flags: MessageFlags.Ephemeral });
    } else {
        await interaction.reply({ content: '\u26A0 Bookmark already exists \u26A0', flags: MessageFlags.Ephemeral });
    }
}

async function bookmarkDelete(interaction, link, name) {
    if (link === null && name === null) {
        await interaction.reply({ content: '\u26A0 Provide either a message link or bookmark name \u26A0', flags: MessageFlags.Ephemeral });
        return;
    } else if (link !== null) {
        await Bookmark.destroy({ where: { discordSnowflake: interaction.user.id, link: link } });
        await interaction.reply({ content: 'implement bookmark delete', flags: MessageFlags.Ephemeral });
    } else if (name !== null) {
        await Bookmark.destroy({ where: { discordSnowflake: interaction.user.id, name: name } });
        await interaction.reply({ content: 'implement bookmark delete', flags: MessageFlags.Ephemeral });
    }
}

async function bookmarkGet(interaction, name, folder) {
    await interaction.reply({ content: 'implement bookmarkGet', flags: MessageFlags.Ephemeral });
}

async function bookmarkDM(interaction) {
    const bookmarks = await Bookmark.findAll({
        where: { discordSnowflake: interaction.user.id },
        raw: true,
    });

    const numDMs = 1; // TODO: temp
    const confirmBtn = new ButtonBuilder()
        .setCustomId('confirmBtn')
        .setLabel('Confirm')
        .setStyle(ButtonStyle.Success);

    const cancelBtn = new ButtonBuilder()
        .setCustomId('cancelBtn')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder()
        .addComponents(confirmBtn, cancelBtn);
    await interaction.reply({
        content: `This will send ${numDMs} direct message(s)`,
        components: [row],
        flags: MessageFlags.Ephemeral,
    });
    // await interaction.user.send('test');
    // console.log(interaction);
    console.log(JSON.stringify(bookmarks));
}