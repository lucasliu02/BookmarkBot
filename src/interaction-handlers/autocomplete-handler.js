import { Bookmark, Folder } from '../database/models/index.js';

export async function autocompleteHandler(interaction) {
    console.log(interaction.commandName + interaction.options.getSubcommand());

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        // ! queries db on each autocomplete interaction
        // TODO: implement caching or some other form of solution?
        const commandName = interaction.commandName;
        if (commandName === 'bookmark') {
            const subcommandName = interaction.options.getSubcommand();
            if (subcommandName === 'add') {
                autocompleteOneAttribute(interaction, command, 'folder', Folder);
            } else if (subcommandName === 'delete') {
                autocompleteOneAttribute(interaction, command, 'name', Bookmark);
            }
        } else if (commandName === 'folder') {
            const subcommandName = interaction.options.getSubcommand();
            if (subcommandName === 'delete') {
                autocompleteOneAttribute(interaction, command, 'folder', Folder);
            }
        }
    } catch (error) {
        console.error(error);
    }
}

async function autocompleteOneAttribute(interaction, command, attribute, model) {
    const choices = await model.findAll({
        where: { discordSnowflake: interaction.user.id },
        attributes: [attribute],
        raw: true,
    }).then(_choices => _choices.map(choice => choice[attribute]));
    console.log(choices);
    await command.autocomplete(interaction, choices);
}