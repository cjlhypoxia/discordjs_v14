const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const Levels = require('discord.js-leveling');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("查看某人的等級")
        .addUserOption(option => 
            option.setName("user")
                .setDescription("選擇成員")
        ),
    async execute(interaction) {
        const {options, guildId, user} = interaction;
        const member = options.getMember("user") || user;
        const levelUser = await Levels.fetch(member.id, guildId);
        const embed = new EmbedBuilder();
        if (!levelUser) return interaction.reply({content: "該成員沒有任何經驗", ephemeral: true});
        embed.setDescription(`<@${member.id}> 現在 ${levelUser.level} 等，擁有 ${levelUser.xp.toLocaleString()} 經驗值`)
            .setColor("Random")
            .setTimestamp();
        return interaction.reply({embeds: [embed]});
    },
};