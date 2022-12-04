
const {
  MessageType, Mimetype, delay
} = require('@adiwajshing/baileys')
const fs = require("fs");
const { config } = require('process');
global.dbcount = 0;
cmd.dbantispam = {};

client.ev.on('messages.upsert', async (chat) => {
  try {
    const an = process.memoryUsage();
    console.log('RSS : ' + functions.parseByteName(an.rss));
    process.on("uncaughtException", console.log);
    if (!Object.keys(chat.messages[0]).includes('message') || !Object.keys(chat.messages[0]).includes('key')) return;
    if (!chat.messages[0].message) return;
    const msg = await functions.metadataMsg(client, chat.messages[0]);
    if (!(msg.from in client.chats)) client.chats[msg.from] = {};
    if (!("messages" in client.chats[msg.from])) client.chats[msg.from].messages = {};
    msg.messageTimestamp = msg.messageTimestamp || (Date.now() + "").slice(0, 10);
    if (!client.chats[msg.from].messages[msg.id]) client.chats[msg.from].messages[msg.id] = msg;
    if (msg.message.protocolMessage && msg.message.protocolMessage.key && client.chats[msg.from].messages[msg.message.protocolMessage.key.id]) {
      client.chats[msg.from].messages[msg.message.protocolMessage.key.id].deleted = true;
      client.chats[msg.from].messages[msg.message.protocolMessage.key.id].deletedAt = msg.messageTimestamp;
      delete client.chats[msg.from].messages[msg.key.id]
      return;
    }
    require("./handler")(client, msg)

    database.chats = client.chats;
    if (msg.key.id.length < 20) return;
    if (msg.key.remoteJid == 'status@broadcast') return;
    if (!msg.key.fromMe && config.self) return;
    cmd.execute(msg);
    //     if (dbcount > 10) {
    //       Object.keys(database).forEach(tr => {
    //         if (tr == 'session') return;
    //         functions.fs.writeFileSync('./src/json/' + tr + '.json', JSON.stringify(database[tr
    //         ]));
    //       });
    //       dbcount = dbcount % 11;
    //     }
    //     dbcount++;

  } catch (e) {
    if (!String(e).includes('this.isZero')) {
      console.log(e);
      client.reply('6283862323152@s.whatsapp.net', functions.util.format(e));
    }
  }
});
// });



client.ev.on('call', async (cal) => {
  console.log(cal)
  for (let tr of cal) {
    if (tr.isGroup == false) {
      if (tr.status == "offer") {
        client.sendTextWithMentions(tr.from, `  *${client.user.name}* tidak bisa menerima panggilan ${tr.isVideo ? `video` : `suara`}.`)
        const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
   
      }
    }
  }
})