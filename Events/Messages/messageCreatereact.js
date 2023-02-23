module.exports = {
    name: "messageCreate",
    async execute(message,client) {
        const getemoji = client.emojis.cache;
        const emoji = getemoji.map((guildemoji) => {
            return {
                name: guildemoji.name,
                id: guildemoji.id,
            }
        });
        const selectemoji = emoji[Math.floor(Math.random() * emoji.length)];
        if (message.author.bot === false) {
            message.react(`<:${selectemoji.name}:${selectemoji.id}>`)
        } else return;
    }
}