const {EmbedBuilder} = require('discord.js');
const Levels = require('discord.js-leveling');
module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (!message.guild || message.author.bot) return;
        if (message.content.length < 3) return;
        //const long = message.content.length;
        //message.channel.send(`${long}`)
        const randomAmountOfXp = Math.floor(Math.random() * 29) + 1;
        const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);
        if (hasLeveledUp) {
            const user = await Levels.fetch(message.author.id, message.guild.id);
            const levelEmbed = new EmbedBuilder()
                .setTitle("等級提升")
                .setDescription(`**哇** ${message.author}，你升級到了 **${user.level}**等`)
                .setColor("Random")
                .setTimestamp();
            const sendEmbed =  await message.channel.send({embeds: [levelEmbed]});
            sendEmbed.react('😁');
        }
    }
}