const {EmbedBuilder} = require('@discordjs/builders');
const {GuildMember} = require("discord.js");
module.exports = {
    name: "guildMemberAdd",
    execute(member) {
        const {user, guild} = member;
        const welcomeChannel = member.guild.channels.cache.get('894065087822827570')
        const welcomeMessage = `歡迎 <@${member.id}> 加入伺服器`;
        const memberRole = '894065423279063051';
        const welcomeEmbed = new EmbedBuilder()
        .setTitle("新成員")
        .setDescription(welcomeMessage)
        .setColor(0x037821)
        .addFields({name: '成員數', value: `${guild.memberCount}`})
        .setTimestamp();
        welcomeChannel.send({embeds: [welcomeEmbed]});
        member.roles.add(memberRole);
    }
}