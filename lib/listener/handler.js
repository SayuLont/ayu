process.on("uncaughtException", console.log);
const crud = require('../anony/crud')
const cons = require('../anony/Config/constan');
const { stopChatting } = require('../anony/Function/processing');
const fs = require("fs")
const { validmove, setGame } = require("../tictactoe/index");
const { Aki } = require('aki-api');

module.exports = async (client, msg) => {
    try {

        // const akistart = async () => {
        //     const region = 'id';
        //     const aki = new Aki({ region });
        //     await aki.start();
        //     if (aki.question) return client.reply(msg, `${aki.question}`)
        //     if (msg.string == "0" || msg.string.toLowerCase() == "Ya") return aki.step(0)
        //     console.log('question:', aki.question);
        //     console.log('answers: ', aki.answers);
        // }
        // module.exports = { akistart }

        // =================================================antilink
        let antilink = require("../../src/json/antilink.json")
        let isAntilink = antilink.includes(msg.groupData.id)

        if (msg.string.match("chat.whatsapp.com/") && msg.isGroup && isAntilink) {
            let link = await client.groupInviteCode(msg.from)
            if (msg.string.includes(`${link}`)) return client.reply(msg, `Ini Adalah Link Group Ini Anda Tidak Akan Di Kick`)
            if (!msg.client.admin == "admin") return client.reply(msg, 'Tidak Bisa Kick Saya Bukan Admin')
            if (msg.sender.admin == "admin") return client.reply(msg, 'Okelah lu admin gpp :D')
            client.reply(msg.key.remoteJid, { text: "Linkgroup Terdeteksi Dan Akan Saya Kick" })
            client.sendMessage(msg.key.remoteJid, { delete: msg.key })
            return client.groupParticipantsUpdate(msg.key.remoteJid, [msg.sender.jid], "remove")
        }

        const antibot = require("../../src/json/nobot.json")
        const anti = msg.key.id.match('BAE5')
        const IsAntibot = antibot.includes(msg.groupData.id)

        if (anti && msg.isGroup && !msg.key.fromMe && IsAntibot) {
            console.log("Antibot true")
            await client.reply(msg.key.remoteJid, "Bot Terdeteksi Dan Akan Saya Kick")
            return client.groupParticipantsUpdate(msg.key.remoteJid, [msg.sender.jid], "remove")
        };

        let antivo = require("../../src/json/antivo.json")
        let IsAntivo = antivo.includes(msg.groupData.id)

        if (msg.realType == 'viewOnceMessage' && msg.isGroup && IsAntivo) {
            if (msg.type == 'templateMessage') return {}
            let down = msg.downloadMsg
            buf = await down()
            if (msg.type == 'imageMessage') {
                return client.reply(msg.key.remoteJid, { image: buf.buffer, caption: "Anti ViewOnce Aktif\nPercuma si ngirim ViewOnce" })
            } else if (msg.type == 'videoMessage') {
                return client.reply(msg.key.remoteJid, { video: buf.buffer, caption: "Anti ViewOnce Aktif\nPercuma si ngirim ViewOnce" })
            }

        }
        // =================================================user
        let user = require("../../src/json/user.json")
        isUser = user.includes(msg.sender.jid)
        if (cmd && !isUser) {
            user.push(msg.sender.jid)
            fs.writeFileSync('./src/json/user.json', JSON.stringify(user))
        }


        // =================================================tebak gambar detector
        if (global.db_tebak.gambar[msg.from]) {
            const badan = msg.string.toLowerCase();
            global.db_tebak.gambar[msg.from].listed.push(msg);
            if (badan.includes(global.db_tebak.gambar[msg.from].data.answer.toLowerCase())) {
                console.log("Jawaban benar oleh : " + msg.pushName);
                client.sendButton(msg, { text: `Selamat! ${msg.pushName} anda benar 😊 \n\nMau main lagi? ketik : *!tebakkata*\nAtau pencet tombol dibawah ini`, footer: `Games ${config.botname}` }, [{ reply: "Main Lagi!", value: "!tebakgambar" }])
                delete global.db_tebak.gambar[msg.from]
            }
        }


        if (fs.existsSync(`./lib/database/tebak-lagu/${msg.from}.json`)) {
            const badan = msg.string.toLowerCase();
            const datana = JSON.parse(fs.readFileSync(`./lib/database/tebak-lagu/${msg.from}.json`)
            );
            datana.listed.push(msg);
            fs.writeFileSync(`./lib/database/tebak-lagu/${msg.from}.json`, JSON.stringify(datana, null, 2)
            );
            if (badan.includes(datana.data.answer.toLowerCase())) {
                console.log("Jawaban benar oleh : " + msg.pushName);
                client.sendButton(msg, { text: `Selamat! ${msg.pushName} anda benar 😊 \n\nMau main lagi? ketik : *!tebaklagu*\nAtau pencet tombol dibawah ini`, footer: `Games ${config.botname}` }, [{ reply: "Main Lagi!", value: "!tebaklagu" }])
                fs.unlinkSync(`./lib/database/tebak-lagu/${msg.from}.json`);
            }
        }

        if (fs.existsSync(`./lib/database/tebak-kata/${msg.from}.json`)) {
            const badan = msg.string.toLowerCase();
            const datana = JSON.parse(fs.readFileSync(`./lib/database/tebak-kata/${msg.from}.json`)
            );
            datana.listed.push(msg);
            fs.writeFileSync(`./lib/database/tebak-kata/${msg.from}.json`, JSON.stringify(datana, null, 2)
            );
            if (badan.includes(datana.data.answer.toLowerCase())) {
                console.log("Jawaban benar oleh : " + msg.pushName);
                client.sendButton(msg, { text: `Selamat! ${msg.pushName} anda benar 😊 \n\nMau main lagi? ketik : *!tebakkata*\nAtau pencet tombol dibawah ini`, footer: `Games ${config.botname}` }, [{ reply: "Main Lagi!", value: "!tebakkata" }])
                fs.unlinkSync(`./lib/database/tebak-kata/${msg.from}.json`);
            }
        }

        if (fs.existsSync(`./lib/database/tebak-kalimat/${msg.from}.json`)) {
            const badan = msg.string.toLowerCase();
            const datana = JSON.parse(fs.readFileSync(`./lib/database/tebak-kalimat/${msg.from}.json`)
            );
            datana.listed.push(msg);
            fs.writeFileSync(`./lib/database/tebak-kalimat/${msg.from}.json`, JSON.stringify(datana, null, 2)
            );
            if (badan.includes(datana.data.answer.toLowerCase())) {
                console.log("Jawaban benar oleh : " + msg.pushName);
                client.sendButton(msg, { text: `Selamat! ${msg.pushName} anda benar 😊 \n\nMau main lagi? ketik : *!tebakkalimat*\nAtau pencet tombol dibawah ini`, footer: `Games ${config.botname}` }, [{ reply: "Main Lagi!", value: "!tebakkalimat" }])
                fs.unlinkSync(`./lib/database/tebak-kalimat/${msg.from}.json`);
            }
        }

        // =================================================anonchat
        const type = Object.keys(msg?.message)
        function groupBy(list, keyGetter) {
            const map = new Map();
            list.forEach((item) => {
                const key = keyGetter(item);
                const collection = map.get(key);
                if (!collection) {
                    map.set(key, [item]);
                } else {
                    collection.push(item);
                }
            });
            return map;
        }

        function isItemInArray(array, item) {
            for (var i = 0; i < array.length; i++) {
                if (array[i][0].jid == item || array[i][1].jid == item) {
                    return i;
                }
            }
            return -1;
        }

        const args = msg.string.split(/ +/g);
        const cmdn = msg.string.toLowerCase().split(" ")[0] || "";
        const prefix1 = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?@#$%^&.\/\\©^]/.test(cmdn) ? cmdn.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?@#$%^&.\/\\©^]/gi) : "-";

        crud.showChatting()
            .then(async ({
                result
            }) => {
                const filteredChatting = result.filter(i => i.chat_key)
                const filteredSearching = result.filter(i => !i.chat_key)
                const grouped = groupBy(filteredChatting, i => i.chat_key)
                const sesiChat = Array.from(grouped).map(i => i[1])
                // console.log(sesiChat);
                sesiChat.filter(i => i.length == 1).map(i => i[0].jid).forEach((v, i) => {
                    stopChatting(v).then(() => {
                        let button = [{ reply: 'LAPOR KESALAHAN SISTEM', value: prefix1 + 'anonbug' }]
                        let content = 'Mohon maaf kamu telah distop oleh sistem, karna terdeteksi bug! silahkan chat admin untuk melapor agar nomer kamu baik baik saja'
                        client.sendButton(msg, { text: content, footer: 'Anonymouschat MechaBot' }, button)
                    }).catch(console.log)
                })
                const mainIndex = isItemInArray(sesiChat, msg.sender.jid)
                const index1 = sesiChat.findIndex(i => i[0].jid == msg.sender.jid)
                // const index2 = sesiChat.findIndex(i => i[1].jid == sender)
                // console.log(JSON.stringify(anon, null, 4));
                if (msg.string == prefix1 + 'sendprofile' && (filteredChatting.findIndex(i => i.jid == msg.sender.jid) == -1)) {
                    let button = [{ reply: `${cons.display_search}`, value: prefix1 + 'anonstart' }]
                    let content = cons.cannot_sendprofile
                    client.sendButton(msg, { text: content, footer: 'Anonymouschat MechaBot' }, button)
                    return
                }
                if (mainIndex != -1) { // Jika user mempunyai sesi chat
                    if (msg.from.includes('g.us')) return // Jika dari grup jangan respon
                    if (msg.fromMe) return // Jika dikirim dari bot maka jangan respon (mencegah spam)
                    // console.log(JSON.stringify(sesiChat, null, 2), anon.key); 
                    const real = index1 != -1 ? 'pertama' : 'kedua' // Cek posisi pertama atau kedua
                    const partnerJID = real == 'pertama' ? sesiChat[mainIndex][1]?.jid : sesiChat[mainIndex][0]?.jid // Jika posisi pertama, maka chat dengan kedua 
                    if (msg.string == prefix1 + 'sendprofile') { // Kirim profile ke lawan chat
                        const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
                            +
                            'VERSION:3.0\n' +
                            'FN:' + msg.pushName + '\n' // full name
                            +
                            'ORG:AnonChat;\n' // the organization of the contact
                            +
                            'TEL;type=CELL;type=VOICE;waid=' + msg.sender.jid.replace(/@.+/g, '') + ':+' + msg.sender.jid.replace(/@.+/g, '') + '\n' // WhatsApp ID + phone number
                            +
                            'END:VCARD'
                        client.sendMessage(partnerJID, { contacts: { displayName: msg.pushName, contacts: [{ vcard }] } })
                            .then((data) => {
                                client.sendMessage(partnerJID, { text: cons.sending_profile }, {
                                    quoted: data
                                })
                                client.reply(msg.from, cons.profile_sent)
                            })
                    }
                    if (msg.string.startsWith(prefix1)) return // Jika berawal prefix maka jangan respon
                    // kenapa gw bikin prefix1 karena gw pake no prefix klo pake no pref auto chatnya g anyaut
                    // var some = command.find(tr => tr.command.includes(msg.string))
                    // if (msg.string == cmd.command) return client.sendMessage(partnerJID, { text: msg.string }) //buat deteksi klo pake command ngirim text 
                    // Cek tipe pesan
                    if (msg.type == "conversation") {
                        // sendTo(partnerJID, msg)
                        client.sendMessage(partnerJID, { text: msg.string })
                    } else if (msg.type == "extendedTextMessage") {
                        client.sendMessage(partnerJID, { text: msg.string, contextInfo: msg.message["extendedTextMessage"].contextInfo })
                    } else {
                        contextInfo = msg.message[msg.type].contextInfo ?? {}
                        client.sendMessageFromContent(partnerJID, msg.message, { contextInfo })
                    }
                }
            }).catch((e) => console.log(e))

        // ==================================ttc
        try {
            let arrNum = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
            if (fs.existsSync(`./lib/database/tictactoe/${msg.from}.json`)) {
                const boardnow = setGame(`${msg.from}`);
                if (msg.string.toLowerCase() == "y" || msg.string.toLowerCase() == "yes" || msg.string.toLowerCase() == "ya") {
                    if (boardnow.O == msg.sender.jid.replace("@s.whatsapp.net", "")) {
                        if (boardnow.status)
                            return client.reply(msg, `Game telah dimulai sebelumnya!`);
                        const matrix = boardnow._matrix;
                        boardnow.status = true;
                        fs.writeFileSync(`./lib/database/tictactoe/${msg.from}.json`, JSON.stringify(boardnow, null, 2)
                        );
                        const chatAccept = `*🎮 Tictactoe Game 🎳*
                
❌ : @${boardnow.X}
⭕ : @${boardnow.O}

Giliran : @${boardnow.turn == "X" ? boardnow.X : boardnow.O}
${matrix[0][0]}  ${matrix[0][1]}  ${matrix[0][2]}
${matrix[1][0]}  ${matrix[1][1]}  ${matrix[1][2]}
${matrix[2][0]}  ${matrix[2][1]}  ${matrix[2][2]}
`;
                        client.reply(msg, { text: chatAccept, mentions: [boardnow.X + "@s.whatsapp.net", boardnow.O + "@s.whatsapp.net"] });

                    } else {
                        client.reply(msg, { text: `Opsi ini hanya untuk @${boardnow.O} !`, mentions: [boardnow.O + "@s.whatsapp.net"] });
                    }
                } else if (msg.string.toLowerCase() == "n" || msg.string.toLowerCase() == "no" || msg.string.toLowerCase() == "tidak") {
                    if (boardnow.O == msg.sender.jid.replace("@s.whatsapp.net", "")) {
                        if (boardnow.status)
                            return client.reply(msg, `Game telah dimulai sebelumnya!`);
                        fs.unlinkSync(`./lib/database/tictactoe/${msg.from}.json`);
                        client.reply(msg, { text: `Sayangnya tantangan @${boardnow.X} ditolak ❌😕`, mentions: [boardnow.X + "@s.whatsapp.net"] });

                    } else {
                        client.reply(msg, { text: `Opsi ini hanya untuk @${boardnow.O} !`, mentions: [boardnow.O + "@s.whatsapp.net"] });
                    }
                }
                if (msg.isGroup) {
                    if (arrNum.includes(msg.string)) {
                        // if (!fs.existsSync(`./lib/tictactoe/db/${from}.json`)) return {}
                        const boardnow = setGame(`${msg.from}`);
                        if (
                            (boardnow.turn == "X" ? boardnow.X : boardnow.O) !=
                            msg.sender.jid.replace("@s.whatsapp.net", "")
                        )
                            return;
                        const moving = validmove(Number(msg.string), `${msg.from}`);
                        const matrix = moving._matrix;
                        if (moving.isWin) {
                            if (moving.winner == "SERI") {
                                const chatEqual = `*🎮 Tictactoe Game 🎳*
          
Game berakhir seri 😐
`;
                                client.reply(msg, `${chatEqual}`);
                                fs.unlinkSync(`./lib/database/tictactoe/${msg.from}.json`);
                                return;
                            }
                            const winnerJID = moving.winner == "O" ? moving.O : moving.X;
                            const looseJID = moving.winner == "O" ? moving.X : moving.O;
                            const limWin = Math.floor(Math.random() * 20) + 10;
                            const limLoose = Math.floor(Math.random() * 10) + 5;
                            const chatWon = `*🎮 Tictactoe Game 🎳*
          
Telah dimenangkan oleh @${winnerJID} 😎👑
`;
                            // giftLimit(winnerJID + "@s.whatsapp.net", limWin);
                            // pushLimit(looseJID + "@s.whatsapp.net", limLoose);
                            client.reply(msg, { text: chatWon, mentions: [moving.winner == "O" ? moving.O + "@s.whatsapp.net" : moving.X + "@s.whatsapp.net"] })
                            fs.unlinkSync(`./lib/database/tictactoe/${msg.from}.json`);
                        } else {
                            const chatMove = `*🎮 Tictactoe Game 🎳*
          
❌ : @${moving.X}
⭕ : @${moving.O}
    
Giliran : @${moving.turn == "X" ? moving.X : moving.O}
${matrix[0][0]}  ${matrix[0][1]}  ${matrix[0][2]}
${matrix[1][0]}  ${matrix[1][1]}  ${matrix[1][2]}
${matrix[2][0]}  ${matrix[2][1]}  ${matrix[2][2]}
`;

                            client.reply(msg, { text: chatMove, mentions: [moving.X + "@s.whatsapp.net", moving.O + "@s.whatsapp.net",] })
                        }
                    }
                }
            }

        } catch (e) {
            client.reply(msg, `Bidang Tersebut Telah Terisi`)
        }
        // if (global.dbaki[msg.sender.jid]) {
        //     if (global.dbaki[msg.sender.jid].progress >= 70 || global.dbaki[msg.sender.jid].currentStep >= 78) {
        //         await global.dbaki[msg.sender.jid].win();
        //         // await client.sendAdReply(msg, { image: global.dbaki[msg.sender.jid].answers[0].absolute_picture_path, caption: `Saya Menebak\n\n- ${global.dbaki[msg.sender.jid].answers[0].name}\n- ${global.dbaki[msg.sender.jid].answers[0].description}\n- Kemungkinan: ${global.dbaki[msg.sender.jid].answers[0].proba}%` }, { title: msg.pushName, body: `Akinator by MechaBot `, thumbnail: akiimg.win, mediaType: 1, mediaUrl: "https://www.instagram.com/sgt_prstyo", sourceUrl: "https://www.instagram.com/sgt_prstyo" })
        //         await client.sendButton(msg, { image: global.dbaki[msg.sender.jid].answers[0].absolute_picture_path, caption: `Saya Menebak\n\n- ${global.dbaki[msg.sender.jid].answers[0].name}\n- ${global.dbaki[msg.sender.jid].answers[0].description}\n- Kemungkinan: ${global.dbaki[msg.sender.jid].answers[0].proba}%` }, [{ reply: "Sebelumnya", value: "!akiback" }, { reply: "Benar", value: "!akidone" }, { reply: "Bukan", value: "!akinext" }])
        //         global.dbnext[msg.sender.jid] = 0;
        //         // await functions.delay(150000);
        //         if (command != "akinext" || command != "akiback") {
        //             await functions.delay(150000);
        //             delete global.dbaki[msg.sender.jid];
        //         }
        //         // delete global.dbaki[msg.sender.jid];
        //         return 0;
        //     }
        // }
    } catch (e) {
        if (!String(e).includes('this.isZero')) {
            console.log(e);
            client.reply(config.ownerNumber[0] + '@s.whatsapp.net', functions.util.format(e));
        }
    }
}
