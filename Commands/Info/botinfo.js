const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const cpuStat = require('cpu-stat');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("查看機器人資訊"),
    execute(interaction, client) {
        const days = Math.floor(client.uptime / 86400000);
        const hours = Math.floor(client.uptime / 3600000) % 24;
        const minutes = Math.floor(client.uptime / 60000) % 60;
        const seconds = Math.floor(client.uptime / 1000) % 60;
        cpuStat.usagePercent(function (error, percent) {
            if(error) return interaction.reply({content: `${error}`})
            const memoryUsage = formatBytes(process.memoryUsage().heapUsed)
            const node = process.version
            const cpu = percent.toFixed(2)
            const embed = new EmbedBuilder()
            .setTitle("機器人資訊")
            .setColor("Random")
            .addFields(
                {name: "開發者", value: "哭哭肥宅", inline: true},
                {name: "名稱", value: `${client.user.username}`, inline: true},
                {name: "ID:", value: `${client.user.id}`, inline: true},
                {name: "建立日期", value: "2023/1/31"},
                {name: "幫助指令", value: "/help"},
                {name: "運作時間", value: `\`${days}\` 天 \`${hours}\` 小時 \`${minutes}\` 分鐘 \`${seconds}\` 秒`},
                {name: "BOT Ping", value: `${client.ws.ping}ms`},
                {name: "Node version", value: `${node}`},
                {name: "Cpu usage", value: `${cpu}`},
                {name: "Memory usage", value: `${memoryUsage}`}
            )
            .setTimestamp();
            interaction.reply({embeds: [embed]});
        })
        function formatBytes(a, b) {
            let c = 1024
            d = b || 2
            e = ['B', 'KB', 'MB', 'GB', 'TB']
            f = Math.floor(Math.log(a) / Math.log(c))
            return parseFloat((a / Math.pow(c, f)).toFixed(d)) + '' + e[f];
        }
    }
}