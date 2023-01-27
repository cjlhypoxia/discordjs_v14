const {ChannelType, ButtonBuilder, EmbedBuilder, ActionRowBuilder, ButtonInteraction, ButtonStyle, PermissionFlagsBits} = require('discord.js');
const ticketSchema = require("../../Models/Ticket");
const {ticketParent, everyone} = require("../../config.json");
module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        const {guild, member, customId, channel} = interaction;
        const {ViewChannel, SendMessages, ManageChannels, ReadMessageHistory} = PermissionFlagsBits;
        const ticketId = Math.floor(Math.random() * 9000) + 10000;
        if (!interaction.isButton()) return;
        if (!["member", "bug", "code", "other"].includes(customId)) return;
        if (!guild.members.me.permissions.has(ManageChannels))
            interaction.reply({ contenet: "我沒有權限", ephemeral: true});
        try {
            await guild.channels.create({
                name: `${member.user.username}-ticket${ticketId}`,
                type: ChannelType.GuildText,
                parent: ticketParent,
                permissionOverwrites: [
                    {   
                        id: everyone,
                        deny: [ViewChannel, SendMessages, ReadMessageHistory],
                    },
                    {
                        id: member.id,
                        allow: [ViewChannel, SendMessages, ReadMessageHistory],
                    },
                ],
            }).then(async (channel) => {
                const newTicketSchema = await ticketSchema.create({
                    GuildID: guild.id,
                    MemberID: member.id,
                    TicketID: ticketId,
                    ChannelID: channel.id,
                    Closed: false,
                    Locked: false,
                    Type: customId,
                });
                const embed = new EmbedBuilder()
                    .setTitle(`${guild.name} - Ticket: ${customId}`)
                    .setDescription("馬上會回覆你")
                    .setFooter({ text: `${ticketId}`, iconURL: member.displayAvatarURL({ dynamic: true})})
                    .setTimestamp();
                const button = new ActionRowBuilder().setComponents(
                    new ButtonBuilder().setCustomId('close').setLabel('close').setStyle(ButtonStyle.Primary).setEmoji('❌'),
                    new ButtonBuilder().setCustomId('lock').setLabel('lock').setStyle(ButtonStyle.Secondary).setEmoji('🔒'),
                    new ButtonBuilder().setCustomId('unlock').setLabel('unlock').setStyle(ButtonStyle.Success).setEmoji('🔓')
                );
                channel.send({
                    embeds: ([embed]),
                    components: [
                        button
                    ]
                });
                interaction.reply({ content: "成功建立", ephemeral: true});
            });
        } catch (err) {
            return console.log(err);
        }
    }
}
