module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (message.interaction === null) {
            message.react('😡')
        } else return;
    }
}