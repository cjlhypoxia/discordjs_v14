const {EmbedBuilder} = require('discord.js');
const translate = require('@iamtraction/google-translate');
module.exports = {
    name: "messageReactionAdd",
    async execute(messageReaction, user) {
        const userbot = user.bot;
        if (userbot) return;
        const reaction = messageReaction.emoji;
        const message = messageReaction.message;
        if (message.content === '') return;
        //console.log(reaction.toString())
        const languages = {
            "auto": "Automatic",
            "af": "Afrikaans",
            "sq": "Albanian", //AL
            "am": "Amharic", //ET
            "ar": "Arabic", //DZ BH AE DJ EG EH ER
            "hy": "Armenian", //AM
            "az": "Azerbaijani", //AZ
            "eu": "Basque", //ES
            "be": "Belarusian", //BY
            "bn": "Bengali", //BD
            "bs": "Bosnian", //BA
            "bg": "Bulgarian", //BG
            "ca": "Catalan", //AD ES
            "ceb": "Cebuano",
            "ny": "Chichewa",
            "🇨🇳": "Chinese Simplified", //zh-cn //CN
            "🇹🇼": "Chinese Traditional", //zh-tw
            "co": "Corsican",
            "hr": "Croatian", //BA
            "cs": "Czech",  //CZ
            "da": "Danish", //DK FO
            "nl": "Dutch", //BQ CW AW BE
            "🇺🇸": "English", //en //AG AI AQ AR AS AU BB BL BS BW BZ CA CC CK CM CW CX DM FJ FK FM GB  BM BW IO VG BI ER
            "eo": "Esperanto",
            "et": "Estonian", //EE
            "tl": "Filipino",
            "fi": "Finnish", //FI
            "fr": "French", // FR BE BF BI BJ BL CA AQ CD CF CG CH CI CM DJ EH GA  BF 
            "fy": "Frisian",
            "gl": "Galician", //ES
            "ka": "Georgian",
            "de": "German", //AT BE CH DE
            "el": "Greek", //CY
            "gu": "Gujarati",
            "ht": "Haitian Creole",
            "ha": "Hausa",
            "haw": "Hawaiian",
            "iw": "Hebrew",
            "hi": "Hindi",
            "hmn": "Hmong",
            "hu": "Hungarian",
            "is": "Icelandic",
            "ig": "Igbo",
            "id": "Indonesian",
            "ga": "Irish", //GB
            "it": "Italian", //CH
            "🇯🇵": "Japanese", //ja //
            "jw": "Javanese",
            "kn": "Kannada",
            "kk": "Kazakh",
            "km": "Khmer",
            "🇰🇷": "Korean", //ko
            "ku": "Kurdish (Kurmanji)",
            "ky": "Kyrgyz",
            "lo": "Lao",
            "la": "Latin",
            "lv": "Latvian",
            "lt": "Lithuanian",
            "lb": "Luxembourgish",
            "mk": "Macedonian",
            "mg": "Malagasy",
            "ms": "Malay", //BN
            "ml": "Malayalam",
            "mt": "Maltese",
            "mi": "Maori",
            "mr": "Marathi",
            "mn": "Mongolian",
            "my": "Myanmar (Burmese)",
            "ne": "Nepali",
            "no": "Norwegian", //BV
            "ps": "Pashto", //🇦🇫
            "fa": "Persian", //🇦🇫
            "pl": "Polish",
            "pt": "Portuguese", //AO BR CV
            "pa": "Punjabi",
            "ro": "Romanian",
            "ru": "Russian", //AQ BY
            "sm": "Samoan",
            "gd": "Scots Gaelic", //GB
            "sr": "Serbian", //BA
            "st": "Sesotho",
            "sn": "Shona",
            "sd": "Sindhi",
            "si": "Sinhala",
            "sk": "Slovak",
            "sl": "Slovenian",
            "so": "Somali", //DJ
            "es": "Spanish", //BO AQ AS CL CO CR CU DO EC EH ES
            "su": "Sundanese",
            "sw": "Swahili",
            "sv": "Swedish", //🇦🇽 FI
            "tg": "Tajik",
            "ta": "Tamil",
            "te": "Telugu",
            "th": "Thai",
            "tr": "Turkish", //CY
            "uk": "Ukrainian",
            "ur": "Urdu",
            "uz": "Uzbek", //AF
            "vi": "Vietnamese",
            "cy": "Welsh", //GB
            "xh": "Xhosa",
            "yi": "Yiddish",
            "yo": "Yoruba",
            "zu": "Zulu"
        };
        const emojiname = reaction.toString();
        const lan = languages[`${emojiname}`]
        if (lan === undefined) return;
        let ortext = await translate(message.content, {to: `${lan}`});
        await message.reply(`${ortext.text}`)
    }
}