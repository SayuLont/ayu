process.on("uncaughtException", console.log);
function toList(messages) {
  let now = Date.now()
  let list = messages.sort((a, b) => b.messageTimestamp - a.messageTimestamp).map((tr, num) => {
    if (!tr.sender) return;
    if (!tr.sender.jid) tr.sender.jid = `Unknown@null`;
    let {
      hours: jam,
      minutes: menit,
      seconds: detik
    } = functions.parseMs(now - Number((tr.deletedAt || tr.messageTimestamp) + "000"))
    return {
      title: num + ". Revoke pesan" + " ~" + tr.pushName,
      description: `${jam} jam ${menit} menit ${detik} detik yang lalu`,
      value: `${config.prefix[0]}revoke ${tr.key.id}|${tr.key.remoteJid}`
    }
  });
  list[0].head = "List Pesan";
  return list.filter(tr => tr);
}

cmd.on(["listsw"], ['message'], async (msg, {
  client, prefix
}) => {
  if (!database.chats["status@broadcast"]) return client.reply(msg, `Tidak Ada Status Di Whatsapp Saat Ini Yabg Tertulis Di Database`)
  let pesan = Object.values(database.chats["status@broadcast"].messages);
  pesan = pesan.filter(tr => tr && tr.sender && tr.sender.jid)
  let deleted = pesan.filter(tr => tr.deleted);
  if (pesan.length == 0) return client.reply(msg, `Tidak Ada Status Di Whatsapp Saat Ini Yabg Tertulis Di Database`)
  return await client.sendButton(msg,
    {
      text: `Menampilkan List Status`,
      footer: `Total: ${pesan.length} Pesan\nDitarik: ${deleted.length} Pesan\n\n---------\nJika Ingin Mendapatkan Sw Ditarik Ketik ${config.prefix[0]}revoke`,
      buttonText: "Pilih Pesan"
    },
    toList(pesan));
});

cmd.on(["caripesan"], ['message'], async (msg, {
  client, query
}) => {
  let pesan = Object.values(database.chats[msg.from].messages);
  pesan = pesan.filter(tr => tr && tr.sender && tr.sender.jid)
  let regex = new RegExp(functions.parseRegex(query.toLowerCase().trim(), 'gi'))
  let filter = pesan.filter(tr => regex.test(tr.string))
  return await client.sendButton(msg,
    {
      text: `Menampilkan List Pesan Yang Di Temukan`,
      footer: `Total: ${pesan.length} Pesan\nDitemukan: ${filter.length} Pesan\n\n---------\nJika Ingin Mendapatkan List Pesan Ketik ${config.prefix[0]}listpesan`,
      buttonText: "Pilih Pesan"
    },
    toList(filter));
}, {
  query: "Masukan Pesan Yang Ingin Di Cari",
  param: "<pesan>"
});

cmd.on(["listpesan"], ['message'], async (msg, {
  client, prefix, query
}) => {
  let reqjid = query ? (query.split(' ').join('').replace(/(\-)/gi, '').replace(/(\+)/gi, '') + "@s.whatsapp.net") : false
  reqjid = reqjid ? reqjid.startsWith('0') ? reqjid.replace('0', '62') : reqjid : false
  let pesan = Object.values(database.chats[msg.mentionedJid && msg.mentionedJid[0] ? msg.from : (query.endsWith('@s.whatsapp.net') || query.endsWith('@g.us') ? query : (reqjid ? reqjid + "@s.whatsapp.net" : msg.from))].messages);
  pesan = pesan.filter(tr => {
    if (msg.mentionedJid && msg.mentionedJid[0]) {
      return tr && tr.sender && tr.sender.jid && tr.sender.jid == msg.mentionedJid[0]
    } else {
      return tr && tr.sender && tr.sender.jid
    }
  })
  let deleted = pesan.filter(tr => tr.deleted);
  return await client.sendButton(msg,
    {
      text: `Menampilkan List Pesan Di Chat ${reqjid ? reqjid.split('@')[0] : 'Ini'}`,
      footer: `Total: ${pesan.length} Pesan\nDitarik: ${deleted.length} Pesan\n\n---------\nJika Ingin Mendapatkan List Pesan Ditarik Ketik ${config.prefix[0]}revoke`,
      buttonText: "Pilih Pesan"
    },
    toList(pesan));
}, {
  param: "<nomor telepon|tag>"
});

/*
cmd.on(['tagpesan'], ['message'], async (msg, {
  client,
  prefix,
  query
}) => {
  if (!query.includes("|")) return;
  let [jid,
    id] = query.split(`|`)
  let result = database.chats[jid.trim()].messages[id.trim()]
  if (!result) return client.reply(msg, {
    text: `Pesan Tidak Ada Dalam Database`
  })
  client.reply(result, {
    text: `Ketik ${prefix}revoke Sambil Tag Pesan Ini Untuk Meng Send Ulang Pesan`
  })
}, {
  query: "--noresp"
})
*/

cmd.on(['revoke', 'resend'], ['message'], async (msg, {
  client, prefix, command, query
}) => {
  if (command == "revoke" && !msg.quotedMsg && (!query || msg.mentionedJid || query.includes("sw"))) {
    if (query.includes("sw") && !database.chats["status@broadcast"]) return client.reply(msg, `Tidak Ada Status Di Whatsapp Saat Ini Yabg Tertulis Di Database`)
    let pesan = query && query.includes("sw") ? Object.values(database.chats["status@broadcast"].messages) : Object.values(database.chats[msg.from].messages);
    pesan = pesan.filter(tr => tr && tr.sender && tr.sender.jid)
    let deleted = pesan.filter(tr => {
      if (msg.mentionedJid && msg.mentionedJid.length != 0) {
        return msg.mentionedJid.includes(tr.sender.jid) && tr.deleted
      } else {
        return tr.deleted
      }
    });
    if (deleted.length == 0) return client.reply(msg, `Tidak Ada Pesan Yang Di Hapus Di Chat Ini Dalam Database`)
    return await client.sendButton(msg,
      {
        text: "Menampilkan List Pesan Dihapus Di Chat Ini",
        footer: `Total: ${pesan.length} Pesan\nDitarik: ${deleted.length} Pesan\n\n---------\nJika Ingin Mendapatkan List Pesan Ketik ${config.prefix[0]}listpesan`,
        buttonText: "Pilih Pesan"
      },
      toList(deleted));
  }
  if ((!query && (!database.chats[msg.from].messages[query.trim()] && !database.chats["status@broadcast"].messages[query.trim()])) && !msg.quotedMsg.quotedMsg) return client.reply(msg, {
    text: "Harap Tag Pesan Yang Terdapat Tag Pesan, Atau Pesan Belum Di Save Di Database"
  })
  let [id,
    jid] = query.split('|')
  let reqjid = !query.includes("|") ? (query.split(' ').join('').replace(/(\-)/gi, '').replace(/(\+)/gi, '') + "@s.whatsapp.net") : false
  reqjid = reqjid ? reqjid.startsWith('0') ? reqjid.replace('0', '62') : reqjid : false
  if (reqjid && (await client.onWhatsApp(reqjid))[0]) {
    let pesan = Object.values(database.chats[reqjid].messages)
    pesan = pesan.filter(tr => tr && tr.sender && tr.sender.jid)
    let deleted = pesan.filter(tr => {
      if (msg.mentionedJid && msg.mentionedJid.length != 0) {
        return msg.mentionedJid.includes(tr.sender.jid) && tr.deleted
      } else {
        return tr.deleted
      }
    });
    if (deleted.length == 0) return client.reply(msg, `Tidak Ada Pesan Yang Di Hapus Di Chat ${reqjid.split('@')[0]} Dalam Database`)
    return await client.sendButton(msg,
      {
        text: "Menampilkan List Pesan Dihapus Di Chat " + reqjid.split('@')[0],
        footer: `Total: ${pesan.length} Pesan\nDitarik: ${deleted.length} Pesan\n\n---------\nJika Ingin Mendapatkan List Pesan Ketik ${config.prefix[0]}listpesan`,
        buttonText: "Pilih Pesan"
      },
      toList(deleted));
  }
  let result = query ? database.chats[jid].messages[id.trim()] || database.chats["status@broadcast"].messages[id.trim()] : msg.quotedMsg.quotedMsg;
  result = result.message
  if (result.conversation) {
    result = {
      extendedTextMessage: {
        text: result.conversation
      }
    }
  }
  return client.sendMessageFromContent(msg, result)
})

cmd.on(['del', 'delete', 'd', 'delet'], ['message'], async (msg, { query, client }) => {
  if (!msg.quotedMsg) return client.reply(msg, "Replay Pesan nya kack")
  if (msg.quotedMsg.key.fromMe) {
    client.sendMessage(msg.from, { delete: msg.quotedMsg.key })
  }
  client.sendMessage(msg.from, { delete: msg.quotedMsg.key })
}, {
  admin: true,
  sensitive: true
});