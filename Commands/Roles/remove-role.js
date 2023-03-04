const RRSchema = require('../../Models/ReactionRoles');
const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('removerole')
        .setDescription('新增身分組')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addRoleOption(option =>
            option.setName('身分組')
            .setDescription('要刪除的身分組')
            .setRequired(true)
        ),
        async execute(interaction) {
            const {options, guildId, member} = interaction;
            const role = options.getRole('身分組');
            try {
                const data = await RRSchema.findOne({ GuildId: guildId});
                if(!data) {
                    return interaction.reply({content: '這裡還沒資料...', ephemeral: true});
                }
                const roles = data.Roles;
                const findRole = roles.find((r) => r.roleId === role.id);
                if(!findRole) {
                    return interaction.reply({content: '這個身分組不存在...', ephemeral: true});
                }
                const filteredRoles = roles.filter((r) => r.roleId !== role.id);
                data.Roles = filteredRoles;
                await data.save();
                return interaction.reply({content: `刪除 ${role.name}`})
            } catch (err) {
                console.log(err);
            }
        }
}