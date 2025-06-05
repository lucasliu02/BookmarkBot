import { Message, MessageFlags, SlashCommandBuilder } from "discord.js";

// ! probably won't work--slash commands cannot access reply message?
// ! see context menu solution in bookmark-context.js

/*
// temp
let folders = []

if(folders.length === 0){
    folders.push('folder1');
    folders.push('folder2');
    folders.push('folder3');
}

export const command = {
    data: new SlashCommandBuilder()
        .setName('bookmark')
        .setDescription('Bookmark a message')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Bookmark name'))
        .addStringOption(option =>
            option.setName('folder')
                .setDescription('Bookmark folder')
                .setAutocomplete(true)),
    async autocomplete(interaction){
        const focusedValue = interaction.options.getFocused();
        const choices = folders;
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(
            filtered.map(choice => ({name: choice, value: choice})),
        );
    },
    async execute(interaction){
        const name = interaction.options.getString('name') ?? '';
        const folder = interaction.options.getString('folder') ?? '';
        await interaction.reply({content: `bookmark name ${name} folder ${folder}`});
    }
};
*/