const { model, Schema } = require('mongoose');
let voiceSchema = new Schema({
    Guild: String,
    User: String,
    Time: Number,
    TimeStamp: Number,
    StartTimeStamp: String,
    EndTimeStamp: String
});
module.exports = model("voicestate", voiceSchema);