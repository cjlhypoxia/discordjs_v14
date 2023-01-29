const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const Levels = require('discord.js-leveling');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("查看等級排行榜"),
    async execute(interaction, client) {
        const {guildId} = interaction;
        const rawLeaderboard =  await Levels.fetchLeaderboard(guildId, 10);
        if (rawLeaderboard.length< 1) return interaction.reply({content: "沒有人在排行榜上", ephemeral: true});
        const embed = new EmbedBuilder();
        const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true);
        const lb = leaderboard.map(e => `**${e.position}.** ${e.username}#${e.discriminator}\n**等級:** ${e.level}\n**經驗** ${e.xp.toLocaleString()}`);
        embed.setTitle("排行榜").setDescription(lb.join("\n\n")).setTimestamp();
        return interaction.reply({ embeds: [embed]});
    },
};