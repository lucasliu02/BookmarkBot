import { ContextMenuCommandBuilder, ApplicationCommandType, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export const command = {
    data: new ContextMenuCommandBuilder()
        .setName('Bookmark')
        .setType(ApplicationCommandType.Message),
        
    async execute(interaction){
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
            flags: MessageFlags.Ephemeral
        });
        
        // ensure that only user who triggered interaction can use buttons
        // although shouldn't be necessary b/c ephemeral
        const collectorFilter = i => i.user.id === interaction.user.id;
        await response.resource.message.awaitMessageComponent({filter: collectorFilter, time: 60_000});

        // ? moved to interactionCreate event to allow button to be used multiple times
        // const editModal = new ModalBuilder()
        // .setCustomId('editModal')
        // .setTitle('Edit Bookmark');
            
        // const nameInput = new TextInputBuilder()
        //     .setCustomId('nameInput')
        //     .setLabel('Bookmark Name:')
        //     .setStyle(TextInputStyle.Short)
        //     .setRequired(false);

        // const folderInput = new TextInputBuilder()
        //     .setCustomId('folderInput')
        //     .setLabel('Bookmark Folder:')
        //     .setStyle(TextInputStyle.Short)
        //     .setRequired(false);

        // const firstActionRow = new ActionRowBuilder().addComponents(nameInput);
        // const secondActionRow = new ActionRowBuilder().addComponents(folderInput);
        // editModal.addComponents(firstActionRow, secondActionRow);

        // // ensure that only user who triggered interaction can use buttons
        // // although shouldn't be necessary b/c ephemeral
        // const collectorFilter = i => i.user.id === interaction.user.id;

        // try {
        //     const confirmation = await response.resource.message.awaitMessageComponent({filter: collectorFilter, time: 60_000});
        //     if(confirmation.customId === 'editBtn'){
        //         console.log('edit button clicked');
        //         await confirmation.showModal(editModal);
        //     }else if(confirmation.customId === 'undoBtn'){
        //         console.log('undo button clicked');
        //         await confirmation.update({content: `${message.url} bookmark deleted`, components: []});
        //     }
        // } catch(error) {
        //     console.error(error);
        // }

    }
}
