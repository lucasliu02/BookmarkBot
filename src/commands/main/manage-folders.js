import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, SlashCommandBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { Bookmark, Folder, User } from '../../database/models/index.js';

export const command = {
    data: new SlashCommandBuilder()
        .setName('folder')
        .setDescription('Manage folders')
        .addSubcommand(subcommand =>
            subcommand.setName('create')
                .setDescription('Create a bookmark folder')
                .addStringOption(option =>
                    option.setName('folder')
                        .setDescription('Bookmark folder name')
                        .setMaxLength(50)
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('set')
                .setDescription('Move an existing bookmark to a folder')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('Bookmark name')
                        .setAutocomplete(true)
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('folder')
                        .setDescription('Bookmark folder name')
                        .setAutocomplete(true)
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('delete')
                .setDescription('Delete folder and all related bookmarks')
                .addStringOption(option =>
                    option.setName('folder')
                        .setDescription('Bookmark folder')
                        .setAutocomplete(true)
                        .setRequired(true))),
    async autocomplete(interaction, choices) {
        const focusedValue = interaction.options.getFocused().toUpperCase();
        const filtered = choices.filter(choice => choice.toUpperCase().includes(focusedValue));
        await interaction.respond(filtered.map(choice => ({ name: choice, value: choice })));
    },
    async execute(interaction) {
        const folder = interaction.options.getString('folder');

        let user = await User.findOne({ where: { discordSnowflake: interaction.user.id } });
        if (!user) {
            user = await new User({ discordSnowflake: interaction.user.id }).save();
        }
        // console.log(interaction);
        switch (interaction.options.getSubcommand()) {
        case 'create': {
            if (folder === 'No folder') {
                await interaction.reply({ content: 'Invalid folder name', flags: MessageFlags.Ephemeral });
                return;
            } else if (folder.indexOf('*') > -1) {
                await interaction.reply({ content: 'Invalid character "*"', flags: MessageFlags.Ephemeral });
                return;
            }
            let dbFolder = await Folder.findOne({ where: { discordSnowflake: interaction.user.id, folder: folder } });
            if (!dbFolder) {
                dbFolder = await new Folder({
                    discordSnowflake: interaction.user.id,
                    folder: folder,
                }).save();
                await interaction.reply({ content: `**${folder}** folder created`, flags: MessageFlags.Ephemeral });
            } else {
                await interaction.reply({ content: `**${folder}** folder already exists`, flags: MessageFlags.Ephemeral });
            }
            break;
        }
        case 'set': {
            const bookmark = await Bookmark.findOne({ where: { discordSnowflake: interaction.user.id, name: interaction.options.getString('name') } });
            await bookmark.update({ folder: folder });
            await interaction.reply({ content: `Bookmark **${bookmark.name}** moved to **${folder}** folder`, flags: MessageFlags.Ephemeral });
            break;
        }
        case 'delete': {
            const confirmBtn = new ButtonBuilder()
                .setCustomId('deleteFolderBtn')
                .setLabel('Delete')
                .setStyle(ButtonStyle.Danger);

            const cancelBtn = new ButtonBuilder()
                .setCustomId('cancelBtn')
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Secondary);

            const row = new ActionRowBuilder()
                .addComponents(confirmBtn, cancelBtn);

            await interaction.reply({
                content: `Delete **${folder}** folder?\n*WARNING: This will delete all bookmarks saved under this folder*`,
                components: [row],
                flags: MessageFlags.Ephemeral,
            });
            // ! sequelize doesn't support compound foreign keys?
            // ? > can't set folder as bookmark fk?
            // ? > can't cascade delete bookmarks with folder?
            // await Bookmark.destroy({ where: { discordSnowflake: interaction.user.id, folder: folder } });
            // await Folder.destroy({ where: { discordSnowflake: interaction.user.id, folder: folder } });
            // await interaction.reply({ content: `**${folder}** folder deleted`, flags: MessageFlags.Ephemeral });
            break;
        }
        }
    },
};

export async function getFolderNames(id, _default) {
    let user = await User.findOne({ where: { discordSnowflake: id } });
    if (!user) {
        user = await new User({ discordSnowflake: id }).save();
        console.log(`saved new user ${id}`);
    }
    const initialized = await Folder.findOne({ where: { discordSnowflake: id } });
    if (!initialized) {
        await new Folder({
            discordSnowflake: id,
            folder: 'No folder',
        }).save();
    }
    const folders = await Folder.findAll({
        where: { discordSnowflake: id },
        attributes: ['folder'],
    }).then(choices => choices.map(choice => choice['folder']));
    console.log(folders);
    const folderOptions = [];
    for (const f of folders) {
        // const dft = (f === _default);
        folderOptions.push(
            new StringSelectMenuOptionBuilder()
                .setLabel(f)
                .setValue(f));
        // .setDefault(f === _default));
    }
    console.log(folderOptions);
    return folderOptions;
}