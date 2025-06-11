import { MessageFlags, SlashCommandBuilder } from 'discord.js';
import { Bookmark, Folder, User } from '../../database/models/index.js';

export const command = {
    data: new SlashCommandBuilder()
        .setName('folder')
        .setDescription('Manage folders')
        .addSubcommand(subcommand =>
            subcommand.setName('add')
                .setDescription('Create a bookmark folder')
                .addStringOption(option =>
                    option.setName('folder')
                        .setDescription('Bookmark folder name')
                        .setMaxLength(50)
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
            console.log(`saved new user ${interaction.user.id}`);
        } else { // TODO: remove this
            console.log('user exists');
        }

        switch (interaction.options.getSubcommand()) {
        case 'add': {
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
        case 'delete':
            // ! sequelize doesn't support compound foreign keys?
            // ? > can't set folder as bookmark fk?
            // ? > can't cascade delete bookmarks with folder?
            await Bookmark.destroy({ where: { discordSnowflake: interaction.user.id, folder: folder } });
            await Folder.destroy({ where: { discordSnowflake: interaction.user.id, folder: folder } });
            await interaction.reply({ content: `**${folder}** folder deleted`, flags: MessageFlags.Ephemeral });
            break;
        }
    },
};