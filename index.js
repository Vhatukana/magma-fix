const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

console.log("Starting MAGMA BOT...");

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log("SCAN THIS QR WITH WHATSAPP:");
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('✅ MAGMA BOT IS ONLINE!');
});

const SECURITY_CODE = process.env.SECURITY_CODE || "MAGMA-2026-SECURE-79X";
const userCode = {};

client.on('message', async msg => {
    const chat = await msg.getChat();
    if (chat.isGroup) return;

    const body = msg.body.trim();

    // Step 1: Ask for code
    if (!userCode[msg.from]) {
        if (body === SECURITY_CODE) {
            userCode[msg.from] = true;
            return msg.reply("✅ Code correct!\n\nWelcome to MAGMA BOT 🔥\n\nSend any message and I will reply.\n\nType *menu* for commands.");
        } else {
            return msg.reply(`🔒 *MAGMA SECURITY*\n\nTo use this bot, send security code:\n\n*${SECURITY_CODE}*\n\nAsk owner for code.`);
        }
    }

    // Step 2: Bot is unlocked
    if (body.toLowerCase() === "menu") {
        return msg.reply(`*MAGMA BOT MENU* 🔥\n\n1. hi\n2. help\n3. owner\n\nJust chat with me!`);
    }

    if (body.toLowerCase() === "hi" || body.toLowerCase() === "hello") {
        return msg.reply("Hey! 🔥 MAGMA BOT here. How can I help?");
    }

    // Auto reply to anything
    return msg.reply(`You said: *${body}*\n\nMAGMA BOT got it ✅`);
});

client.initialize();
