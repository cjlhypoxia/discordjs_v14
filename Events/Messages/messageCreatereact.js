module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (message.author.bot === false) {
            message.react('😡')
        } else return;
    }
}