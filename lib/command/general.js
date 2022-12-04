process.on("uncaughtException", console.log);
const os = require('os')
const speed = require('performance-now');
// const { config } = require('process');

let { list, body, upper, down, line, head, wings, priority } = config.unicode;


 cmd.on(["groupmenu", "menu2"], ["general"], async (msg, { client, prefix, query }) => {
  
    // global.linkgc = 'gada'
    let type = query && query.toLowerCase();
    let lama = [];
    if (!cmd.tags[type]) {
        let list_now = 0;
        let list_nitip = {};
        for (let b in cmd.tags) {
            list_nitip[b] = prefix + `menu${b}`;
            list_now++;
        }
        let text1 = `${functions.parseResult(list_nitip, { body: `${list} %value` })}`;
        const fakstu = functions.fs.readFileSync('./lib/random/katabijax.txt', 'utf-8').split('\n').map((v) => v.replace('\r', ''))

        let resize = await client.reSize(config.mecha_image, 370, 159)
        return client.sendButton(msg, {
            document: Buffer.alloc(10),
            mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            fileName: 'Kurosaki Bot',
            jpegThumbnail: resize,
            pageCount: 1,
            fileLength: 1,
            caption: `Hai ${msg.pushName}👋, Saya adalah Kurosaki-Bot\n\n _${fakstu[Math.floor(Math.random() * fakstu.length + 1)].replace(0, -1)}_\n\n Berikut Adalah Group Menu\nUntuk menampilkan semua menu ketik Allmenu\n` + text1,
            footer: `Bot ini sedang tahap pengembangan, Jikalau ada kesalahan atau error silahkan leporkan kepada owner untuk diperbaiki!\n\n` + config.botname2
        },
            [{ url: "Follow Us Instagram", value: "https://instagram.com/ikiyyye" },
            { url: "Group Bot", value: "ikyy ads" },
            // { call: "Owner Phone", value: "+6285215319934" },
            { reply: "Owner Bot", value: ".owner" },
            { reply: "Info & SNK", value: ".snk" },
            { reply: "Donate", value: ".donate" }])
    } else {
        for (let a of cmd.tags[type]) {
            if (!a.enable) continue;
            let prek = a.prefix ? prefix : ''
            let param = a.param ? a.param : ''
            lama = lama.concat(a.command.map(value => prek + value + ` ${param}`))
        }
        let hasil = `${head}${line.repeat(4)}${list} ${type[0].toUpperCase() + type.slice(1).toLowerCase()} Menu\n`;
        for (let a of cmd.tags[type]) {
            hasil += a.command.map(tr =>
                list + ` !${tr} ${a.param ? a.param : ""}`).join('\n') + `\n${line}\n`;
        }
        hasil = hasil.trim() + `\n${head}${line.repeat(2)}${list}`;
        return client.reply(msg, hasil)
    }
})

cmd.on(["menu", "??", "help"], ["general"], async (msg, { client, prefix }) => {
    
    const fakstu = functions.fs.readFileSync('./lib/random/katabijax.txt', 'utf-8').split('\n').map((v) => v.replace('\r', ''))
    let res = Object.keys(cmd.tags).map(tr => {
        let cmds = `${list} ` + prefix + (cmd.tags[tr].map(rt => rt.command.map(pe => pe + ' ' + (rt.param || " ")).join(`\n${list} ` + prefix).trim()).join(`\n${list} ` + prefix).trim())
        return `*${wings[0]}${tr}${wings[1]}*\n${cmds}`
    })
    let total = `*${priority[0]} Kurosaky Bot ${priority[1]}*\n\nHai ${msg.pushName}👋, Saya adalah Kurosaky-Bot\n\n_${fakstu[Math.floor(Math.random() * fakstu.length + 1)].replace(0, -1)}_ ${functions.readmore(800)}\n\n` + res.join('\n\n')
    // await client.reply(msg, total.trim())
    client.sendButton(msg, { image: config.mecha_image, caption: total.trim() }, [{ url: "Follow Us Instagram", value: "https://instagram.com/ikiyyye" },
    { url: "Saweria", value: "https://saweria.com/IkyyAds" },
    // { call: "Owner Phone", value: "+6285215319934" },
    { reply: "Owner Bot", value: ".owner" },
    { reply: "Info", value: ".snk" },
    { reply: "Donate", value: ".donate" }])
});

cmd.on(['snk', 'info'], ['general'], async (msg, { client }) => {
    let timestamp = speed()
    let latensi = speed() - timestamp
    let text = `
    *[ Info User ]*
*ID*: ${msg.sender.jid}
*User Name*: ${msg.pushName}
*User Number*: ${msg.sender.jid.split("@")[0]}
*Status User*: -

    *[ Info Bot ]*
*🤖 Nama Bot :* *MechaBot-MD* 
*👨🏻‍💻 Creator :* *Squeezed Orange*
*👨🏻‍💻 Number :* @6285215319934
*👬 Total User Online :* *${database.user.length} User*
*🕴 Status Maintenance* : ${config.mainten ? '✅' : '❌'}
*📚 Library :* *Baileys*
*💽 Database :* *MySql*
*💻 Host :* *${os.platform()}*
*⚡ Speed :* ${latensi.toFixed(4)} _Second_ 
*🏻 Ram Usage :* _${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB_ 
*🔌 CPU :* _*${os.cpus()[0].model}*_
    
${msg.isGroup ? `    *[ Info Group ]*
*ID*: ${msg.groupData.id}
*Group Name*: ${msg.groupData.subject}
*Owner*: ${msg.groupData.owner == undefined ? "Tidak Terdeteksi" : "wa.me/" + msg.groupData.owner.split("@")[0]}
*Member*: ${msg.groupData.size}
*Created*: ${functions.parseDate("LLLL", Number(msg.groupData.creation + "000"))}
*Descriptions*: 
${msg.groupData.desc.toString()}
`: ``}

Dengan menggunakan bot ini maka anda *setuju* dengan syarat dan kondisi sebagai berikut:
- Berilah jeda dari setiap perintah.
- Dilarang menelfon bot, atau kalian akan kena block.
- Dilarang keras melakukan spam. Ketahuan = Auto Blokir.
- Bot tidak menyimpan gambar/media yang dikirimkan.
- Bot tidak menyimpan data pribadi anda di server kami.
- Bot tidak bertanggung jawab atas perintah anda kepada bot ini.
- Bot berjalan di server secara terpisah (Bukan dalam HP owner).
- Bot akan secara berkala dimonitoring oleh owner, Kemungkinan chat akan diperiksa oleh owner (untuk melakukan pengecekan kepada member yang melakukan SPAM!).
- Bot Selalu melakukan pembersihan setiap 3 Hari.

Owner Ikyy Ads `
    client.reply(msg, { text: text, mentions: ['6285215319934@s.whatsapp.net'] })
})


cmd.on(['tos'], [], async (msg, { client }) => {
    let caption = `Jiplak bet gasih?`
    client.reply(msg, caption)
})


cmd.on(['donasi', 'donate'], ['general'], async (msg, { client }) => {
    let caption = `
━ Kalian juga dapat Membantu Bot dengan cara Berdonasi *Seikhlasnya*\nHasil donasi untuk memperpanjang server agar bot terus aktif dan Support Owner :
085215319934 (Gopay/Dana/Shoopepay/Pulsa)


Terima kasih untuk kamu yangsudah donasi untuk perkembangan bot ini`
    client.sendPayment(msg, caption)
})

cmd.on(['owner', 'creator'], ['general'], async (msg, { client }) => {
    await client.sendMessage(msg.from, {
        contacts: {
            displayName: 'Ikyy Gagal Maxwin', contacts: [{
                "vcard": "BEGIN:VCARD\nVERSION:3.0\nFN:Ikyy Gagal Maxwin\nORG:Owner Bot;\nitem1.TEL;waid=6285215319934:+62 852-1531-9934\nitem1.X-ABLabel:Telepon\nEND:VCARD"
            },
            {
                "vcard": "BEGIN:VCARD\nVERSION:3.0\nFN:Bot\nORG:Bot Number;\nitem1.TEL;waid=6283197670126:+62 831-9767-0126\nitem1.X-ABLabel:Telepon\nEND:VCARD"
            }]
        }
    })

    let resiz = await client.reSize(config.mecha_image, 300, 300)
    await client.sendButton(msg, {
        location: { jpegThumbnail: resiz }, content: `Haii ${msg.pushName} berikut di atas nomor owner, mohon jangan spam, call dll.
atau klik link dibawah ini`}, [{ url: "klik disini", value: "https://wa.me/6285215319934" }])
})

cmd.on(['p', 'ping'], ['general'], async (msg, { client }) => {
    let timestamp = speed()
    let latensi = speed() - timestamp
    let rs = process.memoryUsage();
    let run = functions.parseMs(process.uptime() * 1000);
    let content = `
*Runtime :*\n ${functions.parseResult(run)}
*Kecepatan Respone :* ${latensi.toFixed(4)} _Second_
*Ram Usage :* _${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB_ 
*RRS :* _${functions.parseByteName(rs.rss)}_
`
    client.reply(msg, content)
}, {
    sensitive: true
});

cmd.on(['maintinance', 'mc'], ['general'], async (msg, { client }) => {
    await client.groupUpdateSubject("6285215319933@g.us", "Bot Maintinance")
    config.mainten.push(true)
}, {
    owner: "--noresp",
});


cmd.on(['speed'], [], async (msg, { client, query }) => {
    client.reply(msg, 'Testing Speed...')
    let cp = require('child_process')
    let { promisify } = require('util')
    let exec = promisify(cp.exec).bind(cp)
    let o
    try {
        o = await exec('python speed.py')
    } catch (e) {
        o = e
    } finally {
        let { stdout, stderr } = o
        if (stdout.trim()) client.reply(msg, `${stdout}`)
        if (stderr.trim()) client.reply(msg, `${stderr}`)
    }
}, {
})
