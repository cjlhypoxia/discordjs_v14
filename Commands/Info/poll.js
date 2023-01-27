const {SlashCommandBuilder, EmbedBuilder, ChannelType ,PermissionFlagsBits} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("開啟投票")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => 
            option.setName("問題")
                .setDescription("要投票的問題")
                .setRequired(true)
            )
            .addChannelOption(option =>
                option.setName("channel")
                    .setDescription("要")
                    .setRequired(true)
                    .addChannelTypes(ChannelType.GuildText)
            ),
        async execute(interaction) {
            const {options} = interaction;
            const channel = options.getChannel("channel");
            const description = options.getString("問題");
            const embed = new EmbedBuilder()
                .setColor("Gold")
                .setDescription(description)
                .setTimestamp();
            try {
                const m = await channel.send({embeds: [embed]});
                await m.react("✅");
                await m.react("❌");
                await interaction.reply({content: "成功建立投票", ephemeral: true});
            }   catch (err) {
                console.log(err);
            }
        }
}