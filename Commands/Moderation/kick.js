const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("踢除成員")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(option => 
        option.setName("target")
        .setDescription("要踢除的成員")
        .setRequired(true)
        )
    .addStringOption(option => 
        option.setName("reason")
        .setDescription("踢除原因")
        ),
    async execute(interaction) {
        const {channel, options} = interaction;
        const user = options.getUser("target");
        const reason = options.getString("reason") || "無原因";
        const member = await interaction.guild.members.fetch(user.id);
        const errEmbed = new EmbedBuilder()
            .setDescription(`拒絕，${user}比你的階級更高`)
            .setColor(0x111111)
            .setTimestamp()
        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [errEmbed], ephemeral: true});
        await member.kick({reason});
        const embed = new EmbedBuilder()
            .setDescription(`成功踢除${user} | 原因：${reason}`);
        await interaction.reply({
            embed: [embed],
        });
        

    }
}
