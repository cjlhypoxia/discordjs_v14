const {SlashCommandBuilder, EmbedBuilder, ChannelType, GuildVerificationLevel, GuildExplicitContentFilter, GuildNSFWLevel, GuildPremiumTier} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("查看此伺服器資訊")
    .setDMPermission(false),
    async execute(interaction) {
        const {guild} = interaction;
        const {members, channels, emojis, roles, stickers} = guild;
        const sortedRoles = roles.cache.map(role => role).slice(1, roles.cache.size).sort((a, b) => b.position - a.position);
        const userRoles = sortedRoles.filter(role => !role.ganaged);
        const managedRoles = sortedRoles.filter(role => role.managed);
        const botCount = members.cache.filter(member => member.user.bot).size;
        const maxDisplayRoles = (roles, maxFieldLength = 1024) => {
            let totalLength = 0;
            const result = [];
            for (const role of roles) {
                const roleString = `<@&${role.id}>`;
                if(roleString.length + totalLength > maxFieldLength)
                break;
                totalLength += roleString.length + 1
                result.push(roleString);
            }
            return result.length;
        }
        const splitPascal = (string, separator) => string?.split(/(?=[A-U])/).join(separator);
        const toPascalCase = (string, separator = false) => {
            const pascal = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g,  (match, chr) => chr.toUpperCase()); 
            return separator ? splitPascal(pascal, separator) : pascal;
        };
        const getChannelTypeSize = type => channels.cache.filter(channel => type.includes(channel.type)).size;
        const totalChannels = getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildAnnouncement, ChannelType.GuildVoice, ChannelType.GuildStageVoice, ChannelType.GuildForum, ChannelType.GuildPublicThread, ChannelType.GuildPrivateThread, ChannelType.GuildNewsThread, ChannelType.GuildCategory]);
        const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`${guild.name}的資訊`)
        .setThumbnail(guild.iconURL({ size: 1024 }))
        .setImage(guild.bannerURL({ size: 1024 }))
        .addFields(
            {name: "Description", value: `${guild.description || "None"}`},
            {
                name: "General",
                value: [
                    `**建立於** <t:${parseInt(guild.createdTimestamp / 1000)}:R>`,
                    `**ID** ${guild.id}`,
                    `**擁有者** <@${guild.ownerId}>`,
                    `**語言** ${new Intl.DisplayNames(["en"], {type: "language"}).of(guild.preferredLocale)}`,
                    `**Vanity URL** ${guild.vanityURLCode || "None"}`
                ].join("\n")
            },
            {name: "Features", value: guild.features?.map(feature => `- ${toPascalCase(feature, " ")}`)?.join("\n") || "None", inline: true},
            {name: "Security",
                value: [
                    `**Explicit Filter** ${splitPascal(GuildExplicitContentFilter[guild.explicitContentFilter], "")}`,
                    `**NSFW level** ${splitPascal(GuildNSFWLevel[guild.nsfwLevel], " ")}`,
                    `**Verification level** ${splitPascal(GuildVerificationLevel[guild.verificationLevel], " ")}`
                ].join("\n"),
                inline: true
            },
            {name: `Member (${guild.memberCount})`,
            value: [
                `**User** ${guild.memberCount - botCount}`,
                `**Bots** ${botCount}`            
            ].join("\n"),
            },
            {name: `User roles (${maxDisplayRoles(userRoles)} of ${userRoles.length})`, value: `${userRoles.slice(0, maxDisplayRoles(userRoles)).join(" ") || "None"}`},
            {name: `Bot roles (${maxDisplayRoles(managedRoles)} of ${managedRoles.length})`, value: `${managedRoles.slice(0, maxDisplayRoles(managedRoles)).join(" ") || "None"}`},
            {name: `Channel Threads and Categories (${totalChannels})`,
            value: [
                `**文字頻道** ${getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildForum, ChannelType.GuildAnnouncement])}`,
                `**語音頻道** ${getChannelTypeSize([ChannelType.GuildVoice, ChannelType.GuildStageVoice])}`,
                `**討論串** ${getChannelTypeSize([ChannelType.GuildPublicThread, ChannelType.GuildPrivateThread, ChannelType.GuildNewsThread])}`,
                `**類別** ${getChannelTypeSize([ChannelType.GuildCategory])}`,
            ].join("\n"),
            inline: true
            },
            {name: `表情與貼圖 (${emojis.cache.size + stickers.cache.size})`,
            value: [
                `**動態** ${emojis.cache.filter(emoji => emoji.animated).size}`,
                `**一般** ${emojis.cache.filter(emoji => !emoji.animated).size}`,
                `**貼圖** ${stickers.cache.size}`,
            ].join("\n"),
            inline: true
            },
            {name: `Nitro`,
            value: [
                `**等級** ${guild.premiumTier || "None"}`,
                `**加成次數** ${guild.premiumSubscriptionCount}`,
                `**加成身分** ${guild.roles.premiumSubscriberRole}`,
                //`**加成者人數** ${guild.members.cache.filter(member => member.premiumSince).size}`,
            ].join("\n"),
            inline: false
            },
            {name: "橫幅", value: guild.bannerURL() ? "** **" : " ? "}
        )
        interaction.reply({embeds: [embed]});
    }
}