const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const Levels = require('discord.js-leveling');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('howmuchxp')
    .setDescription('查看等級所需經驗')
    .addIntegerOption(option => 
        option.setName('等級')
            .setDescription('選擇等級')
            .setRequired(true)
        ),
    async execute(interaction) {
        const {options} = interaction;
        const level = options.getInteger("等級");
        const xpAmount = Levels.xpFor(level);
        interaction.reply({ content: `你需要 ${xpAmount} 經驗達到 ${level} 等`, ephemeral: true});
    }
}