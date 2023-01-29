const {ComponentType, EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("查看所有指令功能"),
    async execute(interaction) {
        const emojis = {
            info: "🪪",
            moderation: "🔧",
            general: "💡",
        };
        const directories = [
            ...new Set(interaction.client.commands.map((cmd) => cmd.folder)),
        ];
        const formatString = (str) => 
            `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
        const categories = directories.map((dir) => {
            const getCommands = interaction.client.commands.filter((cmd) => cmd.folder === dir).map((cmd) => {
                return {
                    name: cmd.data.name,
                    description: cmd.data.description || "0",
                };
            });
            return {
                directory: formatString(dir),
                commands: getCommands,
            };
        });
        const embed = new EmbedBuilder().setDescription(
            "請選擇分類"
        );
        const components = (state) => [
            new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                .setCustomId("helpmenu")
                .setPlaceholder("請選擇分類")
                .setDisabled(state)
                .addOptions(
                     
                    categories.map((cmd) => {
                        return {
                            label: cmd.directory,
                            value: cmd.directory.toLowerCase(),
                            description: `${cmd.directory} 的指令`,
                            emoji: emojis[cmd.directory.toLowerCase() || null],
                        };
                    })
                )
            ),
        ];
        const initialMessage = await interaction.reply({
            embeds: [embed],
            components: components(false),
            ephemeral: true
        });
        const filter = (interaction) =>
            interaction.user.id === interaction.member.id;
        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            componentType: ComponentType.StringSelect,
        });
        collector.on("collect", (interaction) => {
            const [directory] = interaction.values;
            const category = categories.find(
                (x) => x.directory.toLowerCase() === directory
            );
            const categoryEmber = new EmbedBuilder()
            .setTitle(`${formatString(directory)} commands`)
            .setDescription(`關於${directory}的指令`)
            .setTimestamp()
            .addFields(
                category.commands.map((cmd) => {
                    return {
                        name: `\`${cmd.name}\``,
                        value: cmd.description,
                        inline: true,
                    };
                })
            );
            interaction.update({embeds: [categoryEmber], ephemeral: true});
        });
        collector.on("end", () => {
            initialMessage.edit({components: components(true)});
        });
    },
};