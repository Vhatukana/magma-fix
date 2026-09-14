import makeWASocket, { useMultiFileAuthState, DisconnectReason } from 'baileys';
import qrcode from 'qrcode-terminal';
import P from 'pino';

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth');

    const sock = makeWASocket({
        auth: state,
        logger: P({ level: 'silent' }),
        printQRInTerminal: false
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if(qr){
            console.log('SCAN THIS QR:');
            qrcode.generate(qr, {small: true});
        }
        if(connection === 'open'){
            console.log('✅ MAGMA BOT IS ONLINE!');
        }
    });

    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if(!msg.message) return;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        if(text === '!ping'){
            await sock.sendMessage(msg.key.remoteJid, { text: 'pong ✅ Bot is alive' });
        }
    });
}

startBot();
console.log('Starting MAGMA BOT...');
