const {Client, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require('discord.js');
const { execute } = require('./mute');
module.exports = {
    data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("解除靜音成員")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option => 
        option.setName("target")
        .setDescription("選擇要解除靜音的成員")
        .setRequired(true)
        ),
    async execute(interaction) {
        const {guild, options} = interaction;
        const user = options.getUser("target");
        const member = guild.members.cache.get(user.id);
        const errEmbed = new EmbedBuilder()
            .setDescription("出現了錯誤")
            .setColor(0x111111)
        const succesEmbed = new EmbedBuilder()
            .setTitle("Unmuted")
            .setDescription(`成功解除靜音${user}`)
            .setColor(0x111111)
            .setTimestamp();
        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({embeds: [errEmbed], ephemeral: true});
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers))
            return interaction.reply({embeds: [errEmbed], ephemeral: true});
        try {
            await member.timeout(null);
            interaction.reply({embeds: [succesEmbed], ephemeral: true});
        } catch (err) {
            console.log(err);
        }
    }
}