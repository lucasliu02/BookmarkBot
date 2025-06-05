import { Events, MessageFlags } from "discord.js";
import { editButton } from "../components/edit-button.js";

export const event = {
    name: Events.InteractionCreate,
    async execute(interaction){
        if(interaction.isChatInputCommand() || interaction.isMessageContextMenuCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
        
            if(!command){
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
        
            try{
                await command.execute(interaction);
            }catch(error){
                console.error(error);
                if(interaction.replied || interaction.deferred){
                    await interaction.followUp({content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral})
                }else{
                    await interaction.reply({content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral})
                }
            }
        }else if(interaction.isButton()){
            editButton(interaction);
        }else if(interaction.isModalSubmit()){
            if(interaction.customId === 'editModal'){
                const name = interaction.fields.getTextInputValue('nameInput');
                const folder = interaction.fields.getTextInputValue('folderInput');
                console.log(`name ${name} folder ${folder}`);
                await interaction.reply({content: `Set name ${name} folder ${folder}`, flags: MessageFlags.Ephemeral});
            }
        }
    },
};