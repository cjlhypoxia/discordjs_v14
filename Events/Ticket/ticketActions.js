const {ButtonBuilder, EmbedBuilder, PermissionFlagsBits}= require('discord.js');
const {createTranscript} = require('discord-html-transcripts');
const {transcripts} = require("../../config.json");
const ticketSchema = require("../../Models/Ticket");
module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        const {guild, member, customId, channel} = interaction;
        const {ManageChannels, SendMessages} = PermissionFlagsBits;
        if (!interaction.isButton()) return;
        if (!["close", "lock", "unlock"].includes(customId)) return;
        if (!guild.members.me.permissions.has(ManageChannels))
            return interaction.reply({content: "我沒有權限", ephemeral: true});
        const embed = new EmbedBuilder().setColor("Aqua");
        ticketSchema.findOne({ChannelID: channel.id}, async (err, data) => {
            
            if (err) throw err;
            
            if (!data) return;

            const fetchedMember = await guild.members.cache.get(data.MemberID);
            
            switch (customId) {
                case "close":
                    if (data.closed == true)
                        return interaction.reply({content: "此對話已關閉", ephemeral: true});
                    const transcript = await createTranscript(channel, {
                        limit: -1,
                        returnBuffer: false,
                        fileName: `${member.user.username}-ticket${data.Type}-${data.TicketID}.html`,
                    });
                    await ticketSchema.updateOne({ChannelID: channel.id}, {Closed: true});
                    const transcriptsEmbed = new EmbedBuilder()
                        .setTitle(`Transcript Type: ${data.Type}\nID: ${data.TicketID}`)
                        .setFooter({text: member.user.tag, iconURL: member.displayAvatarURL({dynamic: true})})
                        .setTimestamp();
                    const transcriptProcess = new EmbedBuilder()
                        .setTitle("Saving trnscript...")
                        .setDescription("10s")
                        .setColor("Red")
                        .setFooter({text: member.user.tag, iconURL: member.displayAvatarURL({dynamic: true})})
                        .setTimestamp();
                    const res = await guild.channels.cache.get(transcripts).send({
                        embeds: [transcriptsEmbed],
                        files: [transcript],
                    });
                    channel.send({embeds: [transcriptProcess]});
                    setTimeout(function () {
                        member.send({
                            embeds: [transcriptsEmbed.setDescription(`ACCESS ${res.url}`)]
                        }).catch(() => channel.send('無法傳送至訊息'));
                        channel.delete();
                    }, 10000);
                    break;
                case "lock":
                    if (!member.permissions.has(ManageChannels))
                        return interaction.reply({ content: "你沒有權限", ephemeral: true});
                    if(data.Locked == true)
                        return interaction.reply({content: "已經鎖了", ephemeral: true});
                    await ticketSchema.updateOne({ChannelID: channel.id}, {Locked: true});
                    embed.setDescription("對話已被鎖");
                    channel.permissionOverwrites.edit(fetchedMember, {SendMessages: false});
                    return interaction.reply({embeds: [embed]});
                case "unlock":
                    if (!member.permissions.has(ManageChannels))
                        return interaction.reply({ content: "你沒有權限", ephemeral: true});
                    if(data.Locked == false)
                       return interaction.reply({content: "已經解鎖了", ephemeral: true});
                    await ticketSchema.updateOne({ChannelID: channel.id}, {Locked: false});
                    embed.setDescription("對話已被解鎖");
                    channel.permissionOverwrites.edit(fetchedMember, {SendMessages: true});
                    return interaction.reply({embeds: [embed]});
            }
        });
    }
}