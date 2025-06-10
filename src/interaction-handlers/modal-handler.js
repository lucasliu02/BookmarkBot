import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';

export async function modalHandler(interaction) {
    if (interaction.customId === 'editModal') {
        const name = interaction.fields.getTextInputValue('nameInput');
        const folder = interaction.fields.getTextInputValue('folderInput');
        console.log(`name ${name} folder ${folder}`);
        await interaction.reply({ content: `Set name ${name} folder ${folder}`, flags: MessageFlags.Ephemeral });
    } else if (interaction.customId === 'bookmarkModal') {
        const link = interaction.fields.getTextInputValue('linkInput');
        const name = interaction.fields.getTextInputValue('nameInput');
        console.log(`link ${link} name ${name}`);

        // const isLink = new RegExp(/https?:\/\/\S+/g).test(link);
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

        const folderBtn = new ButtonBuilder()
            .setCustomId('folderBtn')
            .setLabel('Set Folder')
            .setStyle(ButtonStyle.Primary);

        // ! temp
        const tempFolders = ['folder1', 'folder2', 'folder3'];
        const folderOptions = [];
        for (const folder of tempFolders) {
            folderOptions.push(
                new StringSelectMenuOptionBuilder()
                    .setLabel(folder)
                    .setValue(folder),
            );
        }
        console.log(folderOptions);

        const folderSelect = new StringSelectMenuBuilder()
            .setCustomId('folderSelect')
            .addOptions(folderOptions);

        const undoBtn = new ButtonBuilder()
            .setCustomId('undoBtn')
            .setLabel('Undo')
            .setStyle(ButtonStyle.Danger);

        const row1 = new ActionRowBuilder()
            // .addComponents(folderSelect, undoBtn);
            .addComponents(folderSelect);
        const row2 = new ActionRowBuilder()
            .addComponents(undoBtn);

        await interaction.reply({
        // const response = await interaction.reply({
            content: `Bookmarked ${name}\n${link}`,
            components: [row1, row2],
            // withResponse: true,     // ? unsure what this actually does
            flags: MessageFlags.Ephemeral,
        });

        // const collectorFilter = i => i.user.id === interaction.user.id;
        // try {
        //     await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 5_000 });
        // } catch {
        //     await interaction.editReply({ components: [] });
        // }
    }
}
