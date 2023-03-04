const { CommandInteraction } = require('discord.js');
module.exports = {
    name: "interactionCreate",
    execute(interaction, client) {
        const {customId, values, guild, member} = interaction;
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                interaction.reply({ content: "指令已無效" });
            }
            command.execute(interaction, client);
        } else if (interaction.isButton()) {
            
            
            if (customId == "認證") {
                const role = interaction.guild.roles.cache.get('894065423279063051');
                return interaction.member.roles
                    .add(role)
                    .then((member) =>
                        interaction.reply({
                            content: `${role} 身分組已套用`,
                            ephemeral: true,
                        }),
                    );
            }
            } else if (interaction.isStringSelectMenu()){
                if (customId == 'reaction-roles') {
                    let allrolesid = interaction.component.data.options.map(rolesid => rolesid.value);
                    let deleterole = allrolesid.filter((e)=>{
                        return values.indexOf(e) === -1
                    });
                    for (let i = 0; i < values.length; i++) {
                        const roleId = values[i];
                        const hasRole = member.roles.cache.has(roleId);
                        switch(hasRole) {
                            case true:
                                break;
                            case false:
                                member.roles.add(roleId);
                                break;
                        }
                    }
                    for (let c = 0; c < deleterole.length; c++) {
                        const deleteroleId = deleterole[c];
                        const hasOldRole = member.roles.cache.has(deleteroleId);
                        switch(hasOldRole) {
                            case true:
                                member.roles.remove(deleteroleId);
                            case false:
                                break;
                        }
                    }
                    if (values.length == 0) return interaction.deferUpdate();
                    interaction.reply({ content: '身分組已更新', ephemeral: true});
                }
            } else {
                return;
        }
    },
};