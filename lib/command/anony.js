process.on("uncaughtException", console.log);
const proc = require('../anony/Function/processing')
const cons = require('../anony/Config/constan')

cmd.on(['anonstart', 'anonsearch', 'anonmulai', 'anoncari'], ['anonymous'], async (msg, { client }) => {
    proc.toQueue({
        name: msg.pushName,
        jid: msg.sender.jid
    }) // Masukan user ke daftar antrian
        .then(() => {
            let button = [{ reply: `${cons.display_stop}`, value: '.anonstop' }]
            let content = `${cons.search}`
            client.sendButton(msg, { text: content, footer: "Anonymous Chat MechaBot" }, button)
            proc.matchQueue(msg.sender.jid)
                .then((data) => {
                    if (data?.code != 'stop') {
                        let button = [{ reply: `${cons.display_stop}`, value: '.anonstop' }, { reply: `${cons.display_skip}`, value: '.anonskip' }]
                        let content = `${cons.partner_found}`
                        client.sendButton(data.partner, { text: content, footer: "Anonymous Chat MechaBot" }, button)
                        // conn.sendMessage(data.partner, , MessageType.text)
                    }

                }).catch(console.log)

        })
        .catch((e) => {
            console.log(e);
            if (e.code == 'isChat') {
                // reply(`${cons.partner_chatting}`)
                let button = [{ reply: `${cons.display_stop}`, value: '.anonstop' }, { reply: `${cons.display_skip}`, value: '.anonskip' }]
                let content = `${cons.partner_chatting}`
                client.sendButton(msg, { text: content, footer: "Anonymous Chat MechaBot" }, button)
            } else if (e.code == 'stillsearch') {
                // reply(`${cons.cannot_start}`)
                let button = [{ reply: `${cons.display_stop}`, value: '.anonstop' }]
                let content = `${cons.cannot_start}`
                client.sendButton(msg, { text: content, footer: "Anonymous Chat MechaBot" }, button)
            } else {
                client.reply(msg, 'Kayanya ada error nih :' + e.message + '\n\nLapor admin aja yaa! ketik /bug [laporanmu]\n\njangan malu malu atau takut, adminnya baik ko, dan bisa memberbaiki bug ini!')
            }
        })

}, {
    private: true
})

cmd.on(['anonskip', 'anonlewati'], ['anonymous'], async (msg, { client }) => {
    proc.stopChatting(msg.sender.jid, true)
        .then((data) => {
            // send(cons.skip)
            let button = [{ reply: `${cons.display_stop}`, value: '.anonstop' }]
            let content = `${cons.skip}`
            client.sendButton(msg, { text: content, footer: "Anonymous Chat MechaBot" }, button)
            let button2 = [{ reply: `${cons.display_search}`, value: '.anonstart' }]
            let content2 = `${cons.partner_stop}`
            client.sendButton(data.partner.jid, { text: content2, footer: "Anonymous Chat MechaBot" }, button2)
            proc.toQueue({
                name: msg.pushName,
                jid: msg.sender.jid
            }) // Masukan user ke daftar antrian
                .then(() => {
                    proc.matchQueue(msg.sender)
                        .then((data) => {
                            let button = [{ reply: `${cons.display_stop}`, value: '.anonstop' }, { reply: `${cons.display_skip}`, value: '.anonskip' }]
                            let content = `${cons.partner_found}`
                            client.sendButton(data.partner, { text: content, footer: "Anonymous Chat MechaBot" }, button)
                        })
                        .catch(console.log)
                })
                .catch((e) => {
                    console.log(e);
                })
        })
        .catch((e) => {
            // reply(util.format(e.message))
            console.log(e);
            if (e.code == 'isChat' || e.code == 'notstart') {
                let button = [{ reply: `${cons.display_search}`, value: '.anonstart' }]
                let content = `${cons.not_start}`
                client.sendButton(msg, { text: content, footer: "Anonymous Chat MechaBot" }, button)
                // reply(`${cons.not_start}`)
            } else if (e.code == 'cannotskip') {
                // reply(`${cons.cannot_skip}`)
                let button = [{ reply: `${cons.display_stop}`, value: '.anonstop' }]
                let content = `${cons.cannot_skip}`
                client.sendButton(msg, { text: content, footer: "Anonymous Chat MechaBot" }, button)
            }
        })
}, {
    private: true
})

cmd.on(['anonstop', 'anonberhenti'], ['anonymous'], async (msg, { client }) => {
    proc.stopChatting(msg.sender.jid)
        .then((data) => {
            let button = [{ reply: `${cons.display_search}`, value: '.anonstart' }]
            let content = `${cons.stop}`
            client.sendButton(msg, { text: content, footer: "Anonymous Chat MechaBot" }, button)
            if (data?.code != 'stopself') {
                let button = [{ reply: `${cons.display_search}`, value: '.anonstart' }]
                let content = `${cons.partner_stop}`
                // sendButton(content, '', button, { jid: data.partner.jid })
                client.sendButton(data.partner.jid, { text: content, footer: "Anonymous Chat MechaBot" }, button)
            }
        })
        .catch((e) => {
            // reply(util.format(e.message))
            console.log(e);
            if (e.code == 'isChat' || e.code == 'notstart') {
                let button = [{ reply: `${cons.display_search}`, value: '.anonstart' }]
                let content = `${cons.not_start}`
                client.sendButton(msg, { text: content, footer: "Anonymous Chat MechaBot" }, button)
            }
        })
}, {
    private: true
})



cmd.on(['menfess', 'menfes', 'manfess', 'manfes', 'confes', 'confess'], ["anonymous"], async (msg, { client, query, command, prefix }) => {
    if (command == 'menfess' || command == 'menfes' || command == 'manfess' || command == 'manfes') {
        let [jid, teks] = query.split('|')
        jid = jid.split(' ').join('').replace("08", "628").replace(/-/gi, '').replace('+', '')
        if (isNaN(jid)) return client.reply(msg, `*Masukkan Nomor Whatsapp nya!*
_Bukan Kalimat :_ *_${jid.split('|')[0]}_*

Contoh : ${prefix}chat 6285215319934 | I Have a Crush On You`);
        jid = jid + "@s.whatsapp.net"
        if (!(await client.onWhatsApp(jid))[0]) return client.reply(msg, "_Nomor Whatsapp Yang Anda Masukkan Tidak Aktif_ \
*_Mohon periksa nomor yang anda kirimkan_*")
        let sensor = ["kontol", "ngentot", "memek", "anjing"].forEach(tr => {
            teks = teks.replace(new RegExp(tr, 'gi'), 'SENSOR')
        })
        await client.sendAdReply(jid, { text: `*Haii Ada Pesan Untukmu*\nPesan:\n\n` + teks + `\n\nTag/Balas?Reply Pesan ini Untuk Membalas Pesan Tersebut\nManfest MechaBot`, mentions: [msg.sender.jid] }, { title: "Manfest MechaBot", description: config.botname, matchedText: global.linkgcme, canonicalUrl: global.linkgcme, thumbnail: config.mecha_image, previewType: 2, renderLargerThumbnail: true, mediaType: 1 })
        await client.sendButton(msg, {
            text: "Sukses Mengirim Pesan", footer: `Sukses Mengirim Pesan
 -> Kontak : wa.me/${jid.split('@')[0]}
 -> Pesan : 

${teks}

Tunggu Sampai Crush Anda Membalas Pesan Ini
${config.botname}`
        }, [{ url: "Join Group Chat", value: global.linkgcme }, { reply: "Menu", value: "!menu" }])
    }

    if (command == 'confes' || command == 'confess') {
        let [jid, teks, clue] = query.split('|')
        jid = jid.split(' ').join('').replace("08", "628").replace(/-/gi, '').replace('+', '')
        if (isNaN(jid)) return client.reply(msg, `*Masukkan Nomor Whatsapp nya!*
_Bukan Kalimat :_ *_${jid.split('|')[0]}_*
        
Contoh : ${prefix}confes 6285215319934 | Aku Sebenarnya Sudah Suka Kamu Dari Lama Tapi Kamu Ga peka:v | Inisial M Temen Sekelasmu`);
        jid = jid + "@s.whatsapp.net"
        if (!(await client.onWhatsApp(jid))[0]) return client.reply(msg, "_Nomor Whatsapp Yang Anda Masukkan Tidak Aktif_ \
*_Mohon periksa nomor yang anda kirimkan_*")
        let sensor = ["kontol", "ngentot", "memek", "anjing"].forEach(tr => {
            teks = teks.replace(new RegExp(tr, 'gi'), 'SENSOR')
        })
        await client.sendAdReply(jid, { text: `*Haii Orang Yang Menyukaimu Mengirim Pesan Nihh *\nPesan:` + teks + `\n\n\nClue:` + clue + `\n\nTag/Balas?Reply Pesan ini Untuk Membalas Pesan Tersebut\nManfest Kurosaki Bot`, mentions: [msg.sender.jid] }, { title: "Manfest MechaBot", description: config.botname, matchedText: global.linkgcme, canonicalUrl: global.linkgcme, thumbnail: config.mecha_image, previewType: 2, renderLargerThumbnail: true, mediaType: 1 })
        await client.sendButton(msg, {
            text: "Sukses Mengirim Pesan", footer: `Sukses Mengirim Pesan
 -> Kontak : wa.me/${jid.split('@')[0]}
 -> Pesan : ${teks} 
 -> Clue : ${clue? clue:"-"}

Tunggu Sampai Crush Anda Membalas Pesan Ini
${config.botname}`
        }, [{ url: "Join Group Chat", value: global.linkgcme }, { reply: "Menu", value: "!menu" }])
    }
}, {
    query: "Penggunaan #menfess nomor|pesan untuknya\n\nContoh : #menfess 6285215319934 | I Have a Crush On You\n\n\nPenggunaan #confes nomor|pesan|clue untuknya\n\nContoh : #confes 6285215319934 | Aku Sebenarnya Sudah Suka Kamu Dari Lama Tapi Kamu Ga peka:v | Inisial M Teman Sekelas Mu",
    param: functions.needed('nomor|pesan|clue'), private: true
})

cmd.on(["", 'balas', 'bls'], [], async (msg, { query, command, client, prefix }) => {
    if (msg.quotedMsg && msg.quotedMsg.mentionedJid[0]) {
        let teks = msg.string
        let sensor = ["kontol", "ngentot", "memek", "anjing"].forEach(tr => {
            teks = teks.replace(new RegExp(tr, 'gi'), 'SENSOR')
        })
        await client.sendAdReply(msg.quotedMsg.mentionedJid[0], { text: `*Haii Ada Pesan Balasan Untukmu*\nPesan:\n\n` + teks + `\n\nTag/Balas?Reply Pesan ini Untuk Membalas Pesan Tersebut\nManfest MechaBot`, mentions: [msg.sender.jid] }, { title: "Manfest MechaBot", description: config.botname, matchedText: global.linkgcme, canonicalUrl: global.linkgcme, thumbnail: config.mecha_image, previewType: 2, renderLargerThumbnail: true, mediaType: 1 })
        await client.sendButton(msg, {
            text: "Sukses Mengirim Balasan", footer: `Sukses Mengirim Balasan
 -> Kontak : Hidden :)
 -> Pesan : 

${teks}

Doi Juga Masih Bisa Balas Pesan Ini Tunguin Aja
${config.botname}`
        }, [{ url: "Join Group Chat", value: global.linkgcme }, { reply: "Menu", value: "!menu" }])
    }
}, {
    private: "--noresp", prefix: false
})