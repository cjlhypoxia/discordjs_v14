const {Client, SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const {loadCommands} = require('../../Handlers/commandHandler');
const {loadEvents} = require('../../Handlers/eventHandler');
require('dotenv').config();
module.exports = {
    data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("重新載入指令或活動")
    .addSubcommand(subcommand =>
        subcommand.setName("commands")
        .setDescription('重新載入指令')
    )
    .addSubcommand(subcommand =>
        subcommand.setName("events")
        .setDescription('重新載入活動')
    ),
    async execute(interaction, client) {
        const { user } = interaction;
        if (user.id !== process.env.admin) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("Random")
                .setDescription("你不能使用該指令")]
                , ephemeral: true
        })
        const sub = interaction.options.getSubcommand();
        const embed = new EmbedBuilder()
            .setTitle("HI")
            .setColor("Random")
        switch (sub) {
            case "commands" : {
                loadCommands(client)
                interaction.reply({embeds: [embed.setDescription("重新載入指令")], ephemeral: true})
                console.log(`${user}`)
            }
            break;
            case "events" : {
                loadEvents(client)
                interaction.reply({embeds: [embed.setDescription("重新載入活動")], ephemeral: true})
                console.log(`${user}`)
            }
        }
    }
}