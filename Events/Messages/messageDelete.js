const countingSchema = require('../../Models/Counting');
const {EmbedBuilder} = require('discord.js');
module.exports = {
    name: "messageDelete",
    async execute(message) {
        const guildId = message.guild.id;
        if(message.author.bot) return;
        if(isNaN(message.content)) return;
        countingSchema.findOne({GuildID: guildId}, async (err, data) => {
            if (!data || !data.Channel) return;
            if (message.channel.id === data.Channel) {
                const embed = new EmbedBuilder()
                .setDescription(`**注意** ${message.author} 數了但刪了訊息 \n最後的數字為 \`${message.content}\``)
                .setColor('Random')
                .setTimestamp()
                message.channel.send({embeds: [embed]})
            }
            if (err) {
                console.log(err);
            }
        })
    }
}