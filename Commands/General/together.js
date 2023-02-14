const {SlashCommandBuilder, EmbedBuilder, ChannelType} = require('discord.js');
const client = require('../../index');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('together')
    .setDescription('開始活動')
    .addStringOption(option => 
        option.setName('活動')
        .setDescription('選擇要開始的活動內容')
        .addChoices(
            {name: "Youtube", value: "youtube"},
        )
        .setRequired(true)
    )
        .addChannelOption(option => 
            option.setName('頻道')
                .setDescription('設定接龍頻道')
                .addChannelTypes(ChannelType.GuildVoice)
    ),
    async execute(interaction) {
        const event = interaction.options.getString('活動');
        const svc = interaction.options.getChannel('頻道');
        const mvc = interaction.member.voice.channel;
        const embed = new EmbedBuilder();
        let a, vc;
        if ((mvc === null) && (svc === null)) {
            return interaction.reply({content: '請在語音頻道內或選擇語音頻道。', ephemeral: true});
        }
        if (mvc === null) {
            vc = svc.id;
        } else {
            vc = mvc.id;
        }
        if (event === 'youtube') {
            a = 'WatchTogether';
            client.discordTogether.createTogetherCode(vc, 'youtube').then(async invite => {
            return interaction.reply({embeds: [embed.setTitle(`點擊我馬上開始活動 ${a}`).setURL(`${invite.code}`).setDescription(`在 <#${vc}> 頻道`).setColor('Random').setTimestamp()]});
            }); 
        }
       
    }        
}