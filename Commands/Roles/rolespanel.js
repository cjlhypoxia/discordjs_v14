const RRSchema = require('../../Models/ReactionRoles.js');
const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolespanel')
        .setDescription('顯示反應身分組選擇板')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
        async execute(interaction) {
            const {options, guildId, guild, channel} = interaction;
            try{
                const data = await RRSchema.findOne({GuildId: guildId});
                if (data.Roles.length === 0)
                    return interaction.reply({content: '還沒有建立資料...' , ephemeral: true});
                const panelEmbed = new EmbedBuilder()
                    .setDescription('請選擇下方的身分組')
                    .setColor('Aqua')
                const options = data.Roles.map(x => {
                    const role = guild.roles.cache.get(x.roleId)
                    return {
                        label: role.name,
                        value: role.id,
                        description: x.roleDescription,
                        emoji: x.roleEmoji || undefined
                    };
                });
                const menuComponents = [
                    new ActionRowBuilder().addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('reaction-roles')
                            .setMaxValues(options.length)
                            .setMinValues(0)
                            .addOptions(options),
                    ),
                ];
                channel.send({ embeds: [panelEmbed], components: menuComponents});
                return interaction.reply({content: '成功建立身分組選擇板', ephemeral: true});
            } catch (err) {
                console.log(err);
            }
        }
}