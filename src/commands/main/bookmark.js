import { ContextMenuCommandBuilder, ApplicationCommandType, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export const command = {
    data: new ContextMenuCommandBuilder()
        .setName('Bookmark')
        .setType(ApplicationCommandType.Message),

    async execute(interaction) {
        const editBtn = new ButtonBuilder()
            .setCustomId('editBtn')
            .setLabel('Edit Bookmark')
            .setStyle(ButtonStyle.Secondary);

        const undoBtn = new ButtonBuilder()
            .setCustomId('undoBtn')
            .setLabel('Undo')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder()
            .addComponents(editBtn, undoBtn);

        const message = await interaction.targetMessage;

        // TODO: setup DB and save message url to DB
        // TODO: update DB entry when name and/or folder is changed
        console.log(`save ${message.url}`);

        const response = await interaction.reply({
            content: `You bookmarked the message:\n${message.url}`,
            components: [row],
            withResponse: true,
            flags: MessageFlags.Ephemeral,
        });

        // ensure that only user who triggered interaction can use buttons
        // although shouldn't be necessary b/c ephemeral
        const collectorFilter = i => i.user.id === interaction.user.id;
        await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
    },
};
