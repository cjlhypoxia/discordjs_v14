const {EmbedBuilder} = require('@discordjs/builders');
const {GuildMember} = require("discord.js");
const Schema = require("../../Models/Welcome");
module.exports = {
    name: "guildMemberAdd",
    async execute(member) {
        Schema.findOne({Guild: member.guild.id}, async (err, data) => {
            if (!data) return;
            let channel = data.Channel;
            let Msg = data.Msg || " ";
            let Role = data.Role;
            const {user, guild} = member;
            const welcomeChannel = member.guild.channels.cache.get(data.Channel);
            const welcomeEmbed = new EmbedBuilder()
            .setTitle("**新成員**")
            .setDescription(`${data.Msg} <@${member.id}>`)
            .setColor(0x111111)
            .addFields({name: '成員人數', value: `${guild.memberCount}`})
            .setTimestamp();
            welcomeChannel.send({embeds: [welcomeEmbed]});
            member.roles.add(data.Role);
        })
    }
}