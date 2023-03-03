const AI = require("stable-diffusion-cjs")
const fs = require("fs")
const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const translate = require('@iamtraction/google-translate');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("imagine")
        .setDescription("使用AI生成圖片 (stable-diffusion-v1-5)")
        .addStringOption(option => 
            option.setName("敘述")
            .setDescription("輸入想像的圖片樣貌")
            .setRequired(true)
        ),
        async execute(interaction) {
            await interaction.deferReply();
            let oprompt = interaction.options.getString('敘述');
            let prompt = await translate(oprompt, {to: 'en'});
            AI.generate(prompt.text, async (result) => {
                if (result.error) {
                    //console.log(result.error)
                    await interaction.editReply(`很抱歉無法生成圖片，您輸入的敘述可能不適當。（${oprompt}）`);
                    return;
                }
                try {
                    if ( result.results.length < 1) {
                        await interaction.editReply(`很抱歉無法生成圖片，您輸入的敘述可能不適當。（${oprompt}）`);
                        return;
                    } else {
                        for (let i = 0; i < result.results.length; i++) {
                            let data = result.results[i].split(",")[1]
                            const buffer = Buffer.from(data, "base64")
                            const filename = `./images/${oprompt}_${i + 1}.png`
                            fs.writeFileSync(filename, buffer)
                        }
                    }
                    if (result.results.length === 1) {
                        const attachment = [
                            new AttachmentBuilder(`./images/${oprompt}_1.png`)
                        ];
                        const embed = new EmbedBuilder().setDescription(`敘述：${oprompt} - ${interaction.user}`).setColor('Random').setImage(`attachment://${oprompt}_1.png`).setTimestamp();    
                        return interaction.editReply({embeds: [embed], files: [attachment][0]});
                    } else if (result.results.length === 2) {
                        const attachment = [
                            new AttachmentBuilder(`./images/${oprompt}_1.png`),
                            new AttachmentBuilder(`./images/${oprompt}_2.png`)
                        ];
                        const embed = new EmbedBuilder().setDescription(`敘述：${oprompt} - ${interaction.user}`).setColor('Random').setImage(`attachment://${oprompt}_1.png,${oprompt}_2.png`).setTimestamp();    
                        return interaction.editReply({embeds: [embed], files: [attachment][0]});
                    } else if (result.results.length === 3) {
                        const attachment = [
                            new AttachmentBuilder(`./images/${oprompt}_1.png`),
                            new AttachmentBuilder(`./images/${oprompt}_2.png`),
                            new AttachmentBuilder(`./images/${oprompt}_3.png`)
                        ];
                        const embed = new EmbedBuilder().setDescription(`敘述：${oprompt} - ${interaction.user}`).setColor('Random').setImage(`attachment://${oprompt}_1.png,${oprompt}_2.png,${oprompt}_3.png`).setTimestamp();    
                        return interaction.editReply({embeds: [embed], files: [attachment][0]});
                    } else {
                        const attachment = [
                            new AttachmentBuilder(`./images/${oprompt}_1.png`),
                            new AttachmentBuilder(`./images/${oprompt}_2.png`),
                            new AttachmentBuilder(`./images/${oprompt}_3.png`),
                            new AttachmentBuilder(`./images/${oprompt}_4.png`)
                        ];
                        const embed = new EmbedBuilder().setDescription(`敘述：${oprompt} - ${interaction.user}`).setColor('Random').setImage(`attachment://${oprompt}_1.png,${oprompt}_2.png,${oprompt}_3.png,${oprompt}_4.png`).setTimestamp();    
                        return interaction.editReply({embeds: [embed], files: [attachment][0]});
                    }
                } catch (e) {
                    console.log(e)
                }
            })
        }
}