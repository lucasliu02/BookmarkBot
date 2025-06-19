import { Op } from 'sequelize';
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
        // TODO: refactor this mess
        const commandName = interaction.commandName;
        if (commandName === 'bookmark') {
            const subcommandName = interaction.options.getSubcommand();
            if (subcommandName === 'add') {
                // find Folder by folder
                autocompleteOneAttribute(interaction, command, 'folder', Folder);
            } else if (subcommandName === 'delete' || subcommandName === 'get') {
                // find find Bookmark by name
                autocompleteOneAttribute(interaction, command, 'name', Bookmark);
            }
        } else if (commandName === 'folder') {
            const subcommandName = interaction.options.getSubcommand();
            if (subcommandName === 'set') {
                // ? should probably use focusedoption instead of subcommandname
                const focusedOption = interaction.options.getFocused(true).name;
                if (focusedOption === 'name') {
                    autocompleteOneAttribute(interaction, command, 'name', Bookmark);
                } else if (focusedOption === 'folder') {
                    autocompleteOneAttribute(interaction, command, 'folder', Folder);
                }
            }
            if (subcommandName === 'delete') {
                // find Folder by folder
                // don't show <No folder> as an option to delete
                autocompleteOneExcludeFolder(interaction, command, 'folder', Folder);
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

async function autocompleteOneExcludeFolder(interaction, command, attribute, model) {
    const choices = await model.findAll({
        where: {
            discordSnowflake: interaction.user.id,
            folder: {
                [Op.not]: 'No folder',
            },
        },
        attributes: [attribute],
        raw: true,
    }).then(_choices => _choices.map(choice => choice[attribute]));
    console.log(choices);
    await command.autocomplete(interaction, choices);
}