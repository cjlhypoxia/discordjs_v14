const {Client, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require('discord.js');
const ms = require("ms");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("靜音成員")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option => 
        option.setName("target")
            .setDescription("選擇成員")
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName("time")
                .setDescription("靜音時長")
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName("reason")
                .setDescription("靜音原因")
                .setRequired(false)
        ),
    async execute(interaction) {
        const {guild, options} = interaction;
        const user = options.getUser("target");
        const member = guild.members.cache.get(user.id);
        const time = options.getString("time");
        const convertedTime = ms(time);
        const reason = options.getString("reason") || "無原因";
        const errEmbed = new EmbedBuilder()
            .setDescription("出現了錯誤")
            .setColor(0x111111)
        const succesEmbed = new EmbedBuilder()
            .setTitle("Muted")
            .setDescription(`成功靜音${user}`)
            .addFields(
                {name: "Reason", value: `${reason}`, inline: true},
                {name: "duration", value: `${time}`, inline: true}
            )
            .setColor(0x111111)
            .setTimestamp();
        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({embeds: [errEmbed], ephemeral: true});
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers))
            return interaction.reply({embeds: [errEmbed], ephemeral: true});
        if (!convertedTime)
            return interaction.reply({embeds: [errEmbed], ephemeral: true});
        try {
            await member.timeout(convertedTime, reason);
            interaction.reply({embeds: [succesEmbed], ephemeral: true});
        } catch (err) {
            console.log(err);
        }
    }
}