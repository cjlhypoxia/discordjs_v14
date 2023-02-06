const {SlashCommandBuilder, ChannelType, EmbedBuilder, PermissionFlagsBits} = require('discord.js');
const countingSchema = require('../../Models/Counting');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('counting')
    .setDescription('設定數字接龍')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addSubcommand(subcommand => 
        subcommand.setName('setup')
            .setDescription('設定數字接龍')
            .addChannelOption(option => 
                option.setName('頻道')
                    .setDescription('設定接龍頻道')
                    .addChannelTypes(ChannelType.GuildText)
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand => 
        subcommand.setName('mute')
            .setDescription('禁言成員在數字接龍')
            .addUserOption(option => 
                option.setName('成員')
                    .setDescription('選擇要禁言的成員')
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand => 
        subcommand.setName('unmute')
            .setDescription('解除禁言成員在數字接龍')
            .addUserOption(option => 
                option.setName('成員')
                    .setDescription('選擇要解除禁言的成員')
                    .setRequired(true)
            )
    ),
    async execute(interaction) {
        const {options, guildId, guild, member} = interaction;
        const sub = options.getSubcommand();
        const channel = options.getChannel('頻道');
        const user = options.getUser('成員');
        const errembed = new EmbedBuilder()
            .setDescription('發生了錯誤')
            .setColor("Random")
            .setTimestamp();
        switch (sub) {
            case "setup" :
                countingSchema.findOne({ GuildID: guild}, async (err, data) => {
                    if (!data) {
                    await countingSchema.create({
                        GuildID: guildId,
                        Channel: channel.id,
                        Count: 1,
                        LastPerson: ""
                    });
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setDescription(`成功在 ${channel} 建立數字接龍`)
                            .setColor('Random')
                            .setTimestamp()
                        ],
                        ephemeral: true
                    })
                    } else if (!data) {
                        data.Channel = channel.id
                        data.save()
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setDescription(`成功以過去設定頻道 ${channel} 建立數字接龍`)
                                .setColor('Random')
                                .setTimestamp()
                            ],
                            ephemeral: true
                        })
                    }
                    if (err) {
                        return interaction.reply({
                            embeds: [errembed],
                            ephemeral: true
                        })
                    }
                });
            break;
            case "mute" :
                countingSchema.findOne({GuildID: guildId}, async (err, data) => {
                    if (!data) {
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setDescription(`你必須先設定數字接龍`)
                                .setColor('Random')
                                .setTimestamp()
                            ],
                            ephemeral: true
                        })
                    } else if (data) {
                        const ch = guild.channels.cache.get(data.Channel);
                        ch.permissionOverwrites.edit(user.id, {SendMessages: false})
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setFooter({ text: `${member.user.tag}`, iconURL: member.displayAvatarURL()})
                                .setDescription(`成功禁言 ${user}`)
                                .setColor('Random')
                                .setTimestamp()
                            ],
                            ephemeral: true
                        })
                    } if (err) {
                        return interaction.reply({embeds: [errembed], ephemeral: true})
                    }
                })
            break;
            case "unmute" :
                countingSchema.findOne({GuildID: guildId}, async (err, data) => {
                    if (!data) {
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setDescription(`你必須先設定數字接龍`)
                                .setColor('Random')
                                .setTimestamp()
                            ],
                            ephemeral: true
                        })
                    } else if (data) {
                        const ch = guild.channels.cache.get(data.Channel);
                        ch.permissionOverwrites.edit(user.id, {SendMessages: true});
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setFooter({ text: `${member.user.tag}`, iconURL: member.displayAvatarURL()})
                                .setDescription(`成功解除禁言 ${user}`)
                                .setColor('Random')
                                .setTimestamp()
                            ],
                            ephemeral: true
                        })
                    } if (err) {
                        return interaction.reply({embeds: [errembed], ephemeral: true})
                    }
                })
            break;
        }
    }
}