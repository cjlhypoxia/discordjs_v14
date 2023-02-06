const {model, Schema} = require('mongoose');
let countingSchema = new Schema({
    GuildID: String,
    Channel: String,
    Count: Number,
    LastPerson: String
})
module.exports = model("Counting", countingSchema)