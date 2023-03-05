const AI = require("stable-diffusion-cjs")
const fs = require("fs")
const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const translate = require('@iamtraction/google-translate');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("imagine")
        .setDescription("使用AI生成圖片 (stable-diffusion)")
        .addStringOption(option => 
            option.setName("敘述")
            .setDescription("輸入想像的圖片樣貌")
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('版本')
            .setDescription('選擇Stable Diffusion版本')
            .setChoices(
                { name: '1.5（快速，建議）', value: '1'},
                { name: '2.1（較久）', value: '2'}
            )
            .setRequired(true)
        ),
        async execute(interaction) {
            await interaction.deferReply();
            let oprompt = interaction.options.getString('敘述');
            const version = interaction.options.getString('版本');
            let prompt = await translate(oprompt, {to: 'en'});
            function randStr(length) {
                var result = [];
                var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                for (var i = 0; i < length; i++) {
                    result.push(chars.charAt(Math.floor(Math.random() * chars.length)));
                }
                return result.join('');
            }
            function im1() {
                AI.generate1(prompt.text, async (result) => {
                    if (result.error) {
                        await interaction.editReply(`很抱歉無法生成圖片，您輸入的敘述可能不適當。（${oprompt}）`);
                        return;
                    }
                    try {
                        const photoname = randStr(8);
                        if ( result.results.length < 1) {
                            await interaction.editReply(`很抱歉無法生成圖片，您輸入的敘述可能不適當。（${oprompt}）`);
                            return;
                        } else {
                            for (let i = 0; i < result.results.length; i++) {
                                let data = result.results[i].split(",")[1]
                                const buffer = Buffer.from(data, "base64")
                                const filename = `./images/${photoname}_${i + 1}.png`
                                fs.writeFileSync(filename, buffer)
                            }
                        }
                        if (result.results.length === 1) {
                            const attachment = [
                                new AttachmentBuilder(`./images/${photoname}_1.png`)
                            ];
                            const embed = new EmbedBuilder().setDescription(`敘述：${oprompt} - ${interaction.user}`).setColor('Random').setImage(`attachment://${photoname}_1.png`).setTimestamp();    
                            return interaction.editReply({embeds: [embed], files: [attachment][0]});
                        } else if (result.results.length === 2) {
                            const attachment = [
                                new AttachmentBuilder(`./images/${photoname}_1.png`),
                                new AttachmentBuilder(`./images/${photoname}_2.png`)
                            ];
                            const embed = new EmbedBuilder().setDescription(`敘述：${oprompt} - ${interaction.user}`).setColor('Random').setImage(`attachment://${photoname}_1.png,${photoname}_2.png`).setTimestamp();    
                            return interaction.editReply({embeds: [embed], files: [attachment][0]});
                        } else if (result.results.length === 3) {
                            const attachment = [
                                new AttachmentBuilder(`./images/${photoname}_1.png`),
                                new AttachmentBuilder(`./images/${photoname}_2.png`),
                                new AttachmentBuilder(`./images/${photoname}_3.png`)
                            ];
                            const embed = new EmbedBuilder().setDescription(`敘述：${oprompt} - ${interaction.user}`).setColor('Random').setImage(`attachment://${photoname}_1.png,${photoname}_2.png,${photoname}_3.png`).setTimestamp();    
                            return interaction.editReply({embeds: [embed], files: [attachment][0]});
                        } else {
                            const attachment = [
                                new AttachmentBuilder(`./images/${photoname}_1.png`),
                                new AttachmentBuilder(`./images/${photoname}_2.png`),
                                new AttachmentBuilder(`./images/${photoname}_3.png`),
                                new AttachmentBuilder(`./images/${photoname}_4.png`)
                            ];
                            const embed = new EmbedBuilder().setDescription(`敘述：${oprompt} - ${interaction.user} - 版本 1.5`).setColor('Random').setImage(`attachment://${photoname}_1.png,${photoname}_2.png,${photoname}_3.png,${photoname}_4.png`).setTimestamp();    
                            return interaction.editReply({embeds: [embed], files: [attachment][0]});
                        }
                    } catch (e) {
                        console.log(e)
                    }
                })
            }
            function im2() {
                AI.generate2(prompt.text, async (result) => {
                    if (result.error) {
                        await interaction.editReply(`很抱歉無法生成圖片，您輸入的敘述可能不適當，或因遠端過多人使用。（${oprompt}）`);
                        return;
                    }
                    try {
                        const photoname = randStr(8);
                        if ( result.results.length < 1) {
                            await interaction.editReply(`很抱歉無法生成圖片，您輸入的敘述可能不適當，或因遠端過多人使用。（${oprompt}）`);
                            return;
                        } else {
                            for (let i = 0; i < result.results.length; i++) {
                                let data = result.results[i].split(",")[1]
                                const buffer = Buffer.from(data, "base64")
                                const filename = `./images/${photoname}_${i + 1}.png`
                                fs.writeFileSync(filename, buffer)
                            }
                        }
                        if (result.results.length === 1) {
                            const attachment = [
                                new AttachmentBuilder(`./images/${photoname}_1.png`)
                            ];
                            const embed = new EmbedBuilder().setDescription(`敘述：${oprompt} - ${interaction.user}`).setColor('Random').setImage(`attachment://${photoname}_1.png`).setTimestamp();    
                            return interaction.editReply({embeds: [embed], files: [attachment][0]});
                        } else if (result.results.length === 2) {
                            const attachment = [
                                new AttachmentBuilder(`./images/${photoname}_1.png`),
                                new AttachmentBuilder(`./images/${photoname}_2.png`)
                            ];
                            const embed = new EmbedBuilder().setDescription(`敘述：${oprompt} - ${interaction.user}`).setColor('Random').setImage(`attachment://${photoname}_1.png,${photoname}_2.png`).setTimestamp();    
                            return interaction.editReply({embeds: [embed], files: [attachment][0]});
                        } else if (result.results.length === 3) {
                            const attachment = [
                                new AttachmentBuilder(`./images/${photoname}_1.png`),
                                new AttachmentBuilder(`./images/${photoname}_2.png`),
                                new AttachmentBuilder(`./images/${photoname}_3.png`)
                            ];
                            const embed = new EmbedBuilder().setDescription(`敘述：${oprompt} - ${interaction.user}`).setColor('Random').setImage(`attachment://${photoname}_1.png,${photoname}_2.png,${photoname}_3.png`).setTimestamp();    
                            return interaction.editReply({embeds: [embed], files: [attachment][0]});
                        } else {
                            const attachment = [
                                new AttachmentBuilder(`./images/${photoname}_1.png`),
                                new AttachmentBuilder(`./images/${photoname}_2.png`),
                                new AttachmentBuilder(`./images/${photoname}_3.png`),
                                new AttachmentBuilder(`./images/${photoname}_4.png`)
                            ];
                            const embed = new EmbedBuilder().setDescription(`敘述：${oprompt} - ${interaction.user} - 版本 2.1`).setColor('Random').setImage(`attachment://${photoname}_1.png,${photoname}_2.png,${photoname}_3.png,${photoname}_4.png`).setTimestamp();    
                            return interaction.editReply({embeds: [embed], files: [attachment][0]});
                            
                        }
                    } catch (e) {
                        console.log(e)
                    }
                })
            }
            if (version === "1") {
                im1();
            }
            if (version === "2") {
                im2();
            }
        }
}