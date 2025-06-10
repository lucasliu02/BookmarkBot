import { MessageFlags, SlashCommandBuilder } from 'discord.js';
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
            subcommand.setName('delete')
                .setDescription('Delete a bookmark (name option will be ignored if link is given)')
                .addStringOption(option =>
                    option.setName('link')
                        .setDescription('Bookmark message link'))
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('Bookmark name')
                        .setAutocomplete(true))),
    async autocomplete(interaction, choices) {
        const focusedValue = interaction.options.getFocused();
        const filtered = choices.filter(choice => choice.includes(focusedValue));
        await interaction.respond(filtered.map(choice => ({ name: choice, value: choice })));
    },
    async execute(interaction) {
        const link = interaction.options.getString('link');
        const name = interaction.options.getString('name');

        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'add') {
            const folder = interaction.options.getString('folder');
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

            // console.log(interaction);

            let user = await User.findOne({ where: { discordSnowflake: interaction.user.id } });
            if (!user) {
                user = await new User({ discordSnowflake: interaction.user.id }).save();
                console.log(`saved new user ${interaction.user.id}`);
            } else { // TODO: remove this
                console.log('user exists');
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
                await interaction.reply({ content: 'Bookmark already exists', flags: MessageFlags.Ephemeral });
            }
        } else if (subcommand === 'delete') {
            if (link === null && name === null) {
                await interaction.reply({ content: 'Provide either a message link or bookmark name', flags: MessageFlags.Ephemeral });
                return;
            } else if (link !== null) {
                await Bookmark.destroy({ where: { discordSnowflake: interaction.user.id, link: link } });
                await interaction.reply({ content: 'implement bookmark delete', flags: MessageFlags.Ephemeral });
            } else if (name !== null) {
                await Bookmark.destroy({ where: { discordSnowflake: interaction.user.id, name: name } });
                await interaction.reply({ content: 'implement bookmark delete', flags: MessageFlags.Ephemeral });
            }
        }
    },
};
