const RRSchema = require('../../Models/ReactionRoles');
const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('addrole')
        .setDescription('新增身分組')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addRoleOption(option =>
            option.setName('身分組')
            .setDescription('要增加的身分組')
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('描述')
            .setDescription('關於身分組的描述')
            .setRequired(false)
        )
        .addStringOption(option => 
            option.setName('表情符號')
            .setDescription('設定身分組的表情符號')
            .setRequired(false)
        ),
        async execute(interaction) {
            const {options, guildId, member} = interaction;
            const role = options.getRole('身分組');
            const description = options.getString('描述');
            const emoji = options.getString('表情符號');
            try {
                if (role.position >= member.roles.highest.position) {
                    return interaction.reply({ content: '我沒有權限', ephemeral: true});
                }
                const data = await RRSchema.findOne({ GuildId: guildId});
                const newRole = {
                    roleId: role.id,
                    roleDescription: description || '沒有描述',
                    roleEmoji: emoji || '',
                }
                if (data) {
                    let roleData = data.Roles.find((x) => x.roleId === role.id);
                    if (roleData) {
                        roleData = newRole;
                    } else {
                        data.Roles = [...data.Roles, newRole]
                    }
                    await data.save();
                } else {
                    await RRSchema.create({
                        GuildId: guildId,
                        Roles: newRole
                    });
                }
                return interaction.reply({content: `新增 ${role.name}`})
                    
            } catch (err) {
                console.log(err);
            }
        }
}