const {SlashCommandBuilder, AttachmentBuilder} = require('discord.js');
const dogecards = require("../../Data/dogecards.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("shibacard")
    .setDescription("發動色色柴犬")
    .addStringOption(option =>
        option.setName("卡類")
            .setDescription("選擇要發動的卡類　（不選擇則隨機發動）")
            .addChoices(
                {name: "怪獸卡", value: "monster"},
                {name: "魔法卡", value: "magic"},
                {name: "陷阱卡", value: "trap"}
            )
    ),
    async execute(interaction) {
        const type = interaction.options.getString("卡類");
        if (!type) {
            const randdoge = dogecards[Math.floor(Math.random() * dogecards.length)];
            if (randdoge.type === "monster") {
                randdoge.type = "怪獸卡"
            } else if (randdoge.type === "trap") {
                randdoge.type = "陷阱卡"
            } else {
                randdoge.type = "魔法卡"
            }
            const attachment = new AttachmentBuilder(`${randdoge.src}`);
            await interaction.reply({content: `${interaction.user} 發動了\n**${randdoge.title}** - ${randdoge.type}`, files: [attachment]});
        } else {
            const dogefilter = dogecards.filter(function(doge, index, array) {
                if(type === "monster") {
                    return doge.type === 'monster';
                } else if (type === "magic") {
                    return doge.type === 'magic';
                } else { 
                    return doge.type === 'trap';     
                } 
            });
            const randtypedoge = dogefilter[Math.floor(Math.random() * dogefilter.length)];
            if (randtypedoge.type === "monster") {
                randtypedoge.type = "怪獸卡"
            } else if (randtypedoge.type === "trap") {
                randtypedoge.type = "陷阱卡"
            } else {
                randtypedoge.type = "魔法卡"
            }
            const aattachment = new AttachmentBuilder(`${randtypedoge.src}`);
            await interaction.reply({content: `${interaction.user} 發動了\n**${randtypedoge.title}** - ${randtypedoge.type}`, files: [aattachment]});
        }
    }
}
