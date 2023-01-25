const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Guild} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("解除成員停權")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(option => 
        option.setName("userid")
        .setDescription("該成員的Discord ID")
        .setRequired(true)
        ),
    async execute(interaction) {
        const {channel, options} = interaction;
        const userId = options.getString("userid");
        try {
            await interaction.guild.members.unban(userId);
            const embed = new EmbedBuilder()
            .setDescription(`成功解除ID: ${userId} 成員的停權`)
            .setColor(0x111111)
            .setTimestamp();
            await interaction.reply({
                embeds: [embed],
            });
        } catch(err) {
            console.log(err);
            const errEmbed = new EmbedBuilder()
                .setDescription(`請輸入有效的成員ID`)
                .setColor(0x111111)
                .setTimestamp();
            interaction.reply({embeds: [errEmbed], ephemeral: true})
        }
    }
}