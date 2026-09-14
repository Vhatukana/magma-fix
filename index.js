const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

console.log('Starting MAGMA BOT...');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

client.on('qr', (qr) => {
    console.log('SCAN QR BELOW:');
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('✅ MAGMA BOT IS ONLINE!');
});

client.on('message', async msg => {
    if(msg.body === '!ping'){
        msg.reply('pong ✅ Bot is alive');
    }
    if(msg.body === 'MAGMA-2026-SECURE-79X'){
        msg.reply('🔓 Unlocked! Bot is yours. Type !ping');
    }
});

client.initialize();
