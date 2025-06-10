import { MessageFlags, SlashCommandBuilder } from 'discord.js';
import { Folder, User } from '../../database/models/index.js';

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
        const focusedValue = interaction.options.getFocused();
        const filtered = choices.filter(choice => choice.includes(focusedValue));
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

        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'add') {
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
        } else if (subcommand === 'delete') {
            await Folder.destroy({ where: { discordSnowflake: interaction.user.id, folder: folder } });
            await interaction.reply({ content: `**${folder}** folder deleted`, flags: MessageFlags.Ephemeral });
        }
    },
};