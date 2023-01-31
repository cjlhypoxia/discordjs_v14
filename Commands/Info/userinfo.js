const {SlashCommandBuilder, EmbedBuilder, UserPremiumType} = require('discord.js');
const {SlashCommandIntegerOption} = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("查看成員的資訊")
    .addUserOption(option =>
        option.setName("成員")
        .setDescription("選擇一位成員")
        .setRequired(false)
        ),
        async execute(interaction) {
            const {options} =interaction;
            const user = options.getUser("成員") || interaction.user;
            const member = await interaction.guild.members.cache.get(user.id);
            const icon = user.displayAvatarURL();
            const tag = user.tag;
            const embed = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({name: tag, iconURL: icon})
            .addFields(
                {name: "名稱", value: `${user}`, inline: false},
                {name: "身分組", value: `${member.roles.cache.map(r => r).join(` ` )}`, inline: false},
                {name: "加入伺服器時間", value: `<t:${parseInt(member.joinedAt / 1000)}:R>`, inline: true},
                {name: "加入Discord時間", value: `<t:${parseInt(member.user.createdAt / 1000)}:R>`, inline: true},
            )
            .setFooter({text: `成員ID： ${user.id}`})
            .setTimestamp()
            await interaction.reply({ embeds: [embed]});
    }
}