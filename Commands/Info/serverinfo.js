const {SlashCommandBuilder, EmbedBuilder, ChannelType, GuildVerificationLevel, GuildExplicitContentFilter, GuildNSFWLevel, GuildPremiumTier, RPCCloseEventCodes} = require('discord.js');
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
        //
    }
}