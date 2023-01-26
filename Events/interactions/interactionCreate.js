const { CommandInteraction } = require('discord.js');
module.exports = {
    name: "interactionCreate",
    execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                interaction.reply({ content: "指令已無效" });
            }
            command.execute(interaction, client);
        } else if (interaction.isButton()) {
            const {customId} = interaction;
                if (customId == "verify") {
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
            } else {
                return;
        }
    },
};


/**module.exports = {
    name: "interactionCreate",
    execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;
        const command = client.commands.get(interaction.commandName);
        if (!command) {
            interaction.reply({ content: "指令已無效" });
        }
        command.execute(interaction, client);
    },
};*/