process.on("uncaughtException", console.log);
const fs = require('fs')
const request = require("request");
const moment = require("moment-timezone");
const { tebak } = require("../tebak")
const { tebak_lagu } = require("../tebak")
const { validmove, setGame } = require("../tictactoe");
var config = JSON.parse(fs.readFileSync('./config.json'))

global.db_tebak = { gambar: {}, kata: {}, lagu: {}, kalimat: {} }

cmd.on(['ttc', 'tictactoe', 'dellttc', 'deletttc'], ['game'], async (msg, { client, command, query, admin }) => {
    if (command == "ttc" || command == "tictactoe") {
        if (fs.existsSync(`./lib/database/tictactoe/${msg.from}.json`)) {
            const boardnow = setGame(`${msg.from}`);
            const matrix = boardnow._matrix;
            const chatMove = `*🎮 Tictactoe Game 🎳*
 Sedang ada sesi permainan digrup ini\n\n@${boardnow.X} VS @${boardnow.O}

❌ : @${boardnow.X}
⭕ : @${boardnow.O}
    
Giliran : @${boardnow.turn == "X" ? boardnow.X : boardnow.O}
${matrix[0][0]}  ${matrix[0][1]}  ${matrix[0][2]}
${matrix[1][0]}  ${matrix[1][1]}  ${matrix[1][2]}
${matrix[2][0]}  ${matrix[2][1]}  ${matrix[2][2]}
`;
            client.reply(msg, { text: chatMove, mentions: [boardnow.X + "@s.whatsapp.net", boardnow.O + "@s.whatsapp.net"] });
            return;
        }
        if (!msg.mentionedJid) return client.reply(msg, `Tag yang ingin jadi lawan anda!\n\nPenggunaan : *!tictactoe <@TagMember>*`);
        const boardnow = setGame(`${msg.from}`);
        console.log(`Start Tictactore ${boardnow.session}`);
        boardnow.status = false;
        boardnow.X = msg.sender.jid.replace("@s.whatsapp.net", "");
        boardnow.O = msg.mentionedJid[0].split("@")[0];
        fs.writeFileSync(`./lib/database/tictactoe/${msg.from}.json`, JSON.stringify(boardnow, null, 2));
        const strChat = `*🎮 Memulai game tictactoe 🎳*
@${msg.sender.jid.replace("@s.whatsapp.net", "")} menantang anda untuk menjadi lawan game
_[ ${query} ] Ketik Y/N untuk menerima atau menolak permainan_ 
`;
        client.reply(msg, { text: strChat, mentions: [msg.sender.jid, query.replace("@", "") + "@s.whatsapp.net"] });
    }
    if (command == "dellttc" || command == "deletttc") {
        let aadmin = msg.sender.admin == "admin" ? true : false || msg.sender.jid.includes(boardnow.X || boardnow.O)
        if (!aadmin) return client.reply(msg, `Hanya admin dan pemulai yang dapat menghapus sesi tictactoe!`);
        if (fs.existsSync("./lib/database/tictactoe/" + msg.from + ".json")) {
            fs.unlinkSync("./lib/database/tictactoe/" + msg.from + ".json");
            client.reply(msg, `Berhasil menghapus sesi di grup ini!`);
        } else {
            client.reply(msg, `Tidak ada sesi yg berlangsung, mohon ketik .tictactoe`);
        }
    }
}, {
    group: true
})


cmd.on(['tebakgambar', 'sisawaktu'], ['game'], async (msg, { client, command }) => {
    if (command == "tebakgambar") {
        if (global.db_tebak.gambar[msg.from]) {
            await client.sendAdReply(msg, { text: `Maaf sesi tebak lagu sedang berlangsung` }, { title: msg.pushName, body: `Tebak Gambar by MechaBot `, thumbnail: config.mecha_image, mediaType: 1, mediaUrl: "https://www.instagram.com/sgt_prstyo", sourceUrl: "https://www.instagram.com/sgt_prstyo" })
                .then(() => {
                    client.sendMessage(msg.from, { text: `Ini dia 👆👆👆` }, { quoted: global.db_tebak.gambar[msg.sender.jid].message });
                })
        } else {
            var y = setInterval(function () {
                if (!global.db_tebak.gambar[msg.from]) return

                var countDownDate = global.db_tebak.gambar[msg.from].expired_on;
                var now = new Date().getTime();
                var distance = countDownDate - now;
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                const countReset = `${minutes}:${seconds}`;
                {
                    global.db_tebak.gambar[msg.from].remaining = countReset;
                }
                if (distance < 0) {
                    clearInterval(y);
                    console.log("Expired Tebak Gambar");
                    client.sendButton(msg, { text: `*❌ [ Expired ] ❌*\n\nSesi tebak gambar telah berhenti karena lebih dari ${config.game_time.gambar} detik 😔\n\nJawaban : ${global.db_tebak.gambar[msg.from].data.answer}\nDimulai oleh : ${global.db_tebak.gambar[msg.from].name} ( @${global.db_tebak.gambar[msg.from].number.replace("@s.whatsapp.net", "")} )\nPesan terdeteksi : ${global.db_tebak.gambar[msg.from].listed.length}\n\nMulai lagi? ketik *!tebakgambar* 😊`, }, [{ reply: "Main Lagi!", value: "!tebakgambar" }])
                    delete global.db_tebak.gambar[msg.from];
                }
            }, 1000);
            const nebak = await tebak(`./src/local/tebak-gambar.json`);
            console.log("Jawaban : " + nebak.jawaban + ` ( ${msg.from} )`);
            const regextebak = new RegExp("[^aeiou ]", "g");
            client.reply(msg.from, { image: nebak.img, caption: `*Tebak gambar diatas ini*\n\nAnda mempunyai waktu ${config.game_time.gambar} detik untuk menebak gambar tersebut.\n\n*CLUE* :   ${nebak.jawaban.replace(regextebak, "_").split("").join(" ")}\n\n\`\`\`Sedang menunggu jawaban...\`\`\`` })
                .then((obe) => {
                    // console.log(obe)
                    global.db_tebak.gambar[msg.from] = {
                        status: true,
                        name: msg.pushName,
                        number: msg.sender.jid,
                        remaining: "",
                        expired_on: moment(new Date())
                            .add(config.game_time.gambar, "seconds")
                            .valueOf(),
                        message: obe,
                        data: {
                            img: nebak.img,
                            answer: nebak.jawaban,
                        },
                        listed: [],
                    };
                });
        }
    }
}, {
})


cmd.on(['tebaklagu', 'sisawaktu'], ['game'], async (msg, { client, command }) => {
    if (command == "tebaklagu") {
        const reader = fs.readdirSync(`./lib/database/tebak-lagu/`);
        if (reader.includes(msg.from + ".json")) {
            client.reply(msg.from, { text: `Maaf sesi tebak lagu sedang berlangsung` })
                .then(() => {
                    const datanya = JSON.parse(
                        fs.readFileSync(`./lib/database/tebak-lagu/${msg.from}.json`)
                    );
                    client.sendMessage(msg.from, { text: `Ini dia 👆👆👆` }, {
                        quoted: datanya.message,
                    });
                })
        } else {
            var y = setInterval(function () {
                if (!fs.existsSync(`./lib/database/tebak-lagu/${msg.from}.json`)) return;
                let db_tebak = JSON.parse(
                    fs.readFileSync(`./lib/database/tebak-lagu/${msg.from}.json`)
                );
                var countDownDate = db_tebak.expired_on;
                var now = new Date().getTime();
                var distance = countDownDate - now;
                var hours = Math.floor(
                    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                const countReset = `${minutes}:${seconds}`;
                {
                    db_tebak.remaining = countReset;
                    fs.writeFileSync(
                        `./lib/database/tebak-lagu/${msg.from}.json`,
                        JSON.stringify(db_tebak, null, 2)
                    );
                }
                if (distance < 0) {
                    clearInterval(y);
                    console.log("Expired Tebak Lagu");
                    fs.writeFileSync(
                        `./lib/database/tebak-lagu/${msg.from}.json`,
                        JSON.stringify(db_tebak, null, 2)
                    );
                    client.reply(msg, { text: `*❌ [ Expired ] ❌*\n\nSesi tebak lagu telah berhenti karena lebih dari ${config.game_time.lagu} detik 😔\n\nJawaban : ${db_tebak.data.answer}\nDimulai oleh : ${db_tebak.name} ( @${db_tebak.number.replace("@s.whatsapp.net", "")} )\nPesan terdeteksi : ${db_tebak.listed.length}\n\nMulai lagi? ketik *!tebaklagu* 😊`, }, {
                        contextInfo: {
                            mentionedJid: [db_tebak.number],
                        },
                    }
                    );
                    fs.unlinkSync(`./lib/database/tebak-lagu/${msg.from}.json`);
                }
            }, 1000);
            const nebak = await tebak(`./src/local/tebaklagu.json`);
            console.log("Jawaban : " + nebak.jawaban + ` ( ${msg.from} )`);
            const regextebak = new RegExp("[^aeiou ]", "g");
            client.reply(msg.from, { audio: nebak.link_song, ptt: true })
            client.reply(msg.from, `*Tebak lagu berikut ini*\n\nAnda mempunyai waktu ${config.game_time.lagu} detik untuk menebak lagu tersebut.\n\n*CLUE* :  Nama Artist:  ${nebak.artist}\n\n\`\`\`Sedang menunggu jawaban...\`\`\``)
                .then((obe) => {
                    // console.log(obe)
                    const objektebak = {
                        status: true,
                        name: msg.pushName,
                        number: msg.sender.jid,
                        remaining: "",
                        expired_on: moment(new Date())
                            .add(config.game_time.lagu, "seconds")
                            .valueOf(),
                        message: obe,
                        data: {
                            audio: nebak.link_song,
                            answer: nebak.jawaban,
                        },
                        listed: [],
                    };
                    fs.writeFileSync(
                        `./lib/database/tebak-lagu/${msg.from}.json`,
                        JSON.stringify(objektebak, null, 2)
                    );
                });
        }
    }
}, {
})

cmd.on(['tebakkata', 'sisawaktu'], ['game'], async (msg, { client, command }) => {
    if (command == "tebakkata") {
        const reader = fs.readdirSync(`./lib/database/tebak-kata/`);
        if (reader.includes(msg.from + ".json")) {
            client.reply(msg.from, { text: `Maaf sesi tebak kata sedang berlangsung` })
                .then(() => {
                    const datanya = JSON.parse(
                        fs.readFileSync(`./lib/database/tebak-kata/${msg.from}.json`)
                    );
                    client.sendMessage(msg.from, { text: `Ini dia 👆👆👆` }, {
                        quoted: datanya.message,
                    });
                })
        } else {
            var y = setInterval(function () {
                if (!fs.existsSync(`./lib/database/tebak-kata/${msg.from}.json`)) return;
                let db_tebak = JSON.parse(
                    fs.readFileSync(`./lib/database/tebak-kata/${msg.from}.json`)
                );
                var countDownDate = db_tebak.expired_on;
                var now = new Date().getTime();
                var distance = countDownDate - now;
                var hours = Math.floor(
                    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                const countReset = `${minutes}:${seconds}`;
                {
                    db_tebak.remaining = countReset;
                    fs.writeFileSync(
                        `./lib/database/tebak-kata/${msg.from}.json`,
                        JSON.stringify(db_tebak, null, 2)
                    );
                }
                if (distance < 0) {
                    clearInterval(y);
                    console.log("Expired Tebak kata");
                    fs.writeFileSync(
                        `./lib/database/tebak-kata/${msg.from}.json`,
                        JSON.stringify(db_tebak, null, 2)
                    );
                    client.reply(msg, { text: `*❌ [ Expired ] ❌*\n\nSesi tebak kata telah berhenti karena lebih dari ${config.game_time.lagu} detik 😔\n\nJawaban : ${db_tebak.data.answer}\nDimulai oleh : ${db_tebak.name} ( @${db_tebak.number.replace("@s.whatsapp.net", "")} )\nPesan terdeteksi : ${db_tebak.listed.length}\n\nMulai lagi? ketik *!tebakkata* 😊`, }, {
                        contextInfo: {
                            mentionedJid: [db_tebak.number],
                        },
                    }
                    );
                    fs.unlinkSync(`./lib/database/tebak-kata/${msg.from}.json`);
                }
            }, 1000);
            const nebak = await tebak(`./src/local/tebakkata.json`);
            console.log("Jawaban : " + nebak.jawaban + ` ( ${msg.from} )`);
            const regextebak = new RegExp("[^aeiou ]", "g");
            client.reply(msg.from, `*Tebak kata berikut ini*\n\nAnda mempunyai waktu ${config.game_time.kata} detik untuk menebak kata tersebut tersebut.\n\n*CLUE* :  ${nebak.soal}\n\n\`\`\`Sedang menunggu jawaban...\`\`\``)
                .then((obe) => {
                    // console.log(obe)
                    const objektebak = {
                        status: true,
                        name: msg.pushName,
                        number: msg.sender.jid,
                        remaining: "",
                        expired_on: moment(new Date())
                            .add(config.game_time.kata, "seconds")
                            .valueOf(),
                        message: obe,
                        data: {
                            audio: nebak.link_song,
                            answer: nebak.jawaban,
                        },
                        listed: [],
                    };
                    fs.writeFileSync(
                        `./lib/database/tebak-kata/${msg.from}.json`,
                        JSON.stringify(objektebak, null, 2)
                    );
                });
        }
    }
}, {
})

cmd.on(['tebakkalimat', 'sisawaktu'], ['game'], async (msg, { client, command }) => {
    if (command == "tebakkalimat") {
        const reader = fs.readdirSync(`./lib/database/tebak-kalimat/`);
        if (reader.includes(msg.from + ".json")) {
            client.reply(msg.from, { text: `Maaf sesi tebak kalimat sedang berlangsung` })
                .then(() => {
                    const datanya = JSON.parse(
                        fs.readFileSync(`./lib/database/tebak-kalimat/${msg.from}.json`)
                    );
                    client.sendMessage(msg.from, { text: `Ini dia 👆👆👆` }, {
                        quoted: datanya.message,
                    });
                })
        } else {
            var y = setInterval(function () {
                if (!fs.existsSync(`./lib/database/tebak-kalimat/${msg.from}.json`)) return;
                let db_tebak = JSON.parse(fs.readFileSync(`./lib/database/tebak-kalimat/${msg.from}.json`));
                var countDownDate = db_tebak.expired_on;
                var now = new Date().getTime();
                var distance = countDownDate - now;
                var hours = Math.floor(
                    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                const countReset = `${minutes}:${seconds}`;
                {
                    db_tebak.remaining = countReset;
                    fs.writeFileSync(
                        `./lib/database/tebak-kalimat/${msg.from}.json`,
                        JSON.stringify(db_tebak, null, 2)
                    );
                }
                if (distance < 0) {
                    clearInterval(y);
                    console.log("Expired Tebak kalimat");
                    fs.writeFileSync(
                        `./lib/database/tebak-kalimat/${msg.from}.json`,
                        JSON.stringify(db_tebak, null, 2)
                    );
                    client.reply(msg, { text: `*❌ [ Expired ] ❌*\n\nSesi tebak kalimat telah berhenti karena lebih dari ${config.game_time.kalimat} detik 😔\n\nJawaban : ${db_tebak.data.answer}\nDimulai oleh : ${db_tebak.name} ( @${db_tebak.number.replace("@s.whatsapp.net", "")} )\nPesan terdeteksi : ${db_tebak.listed.length}\n\nMulai lagi? ketik *!tebaklagu* 😊`, }, {
                        contextInfo: {
                            mentionedJid: [db_tebak.number],
                        },
                    }
                    );
                    fs.unlinkSync(`./lib/database/tebak-kalimat/${msg.from}.json`);
                }
            }, 1000);
            const nebak = await tebak(`./src/local/tebakkalimat.json`);
            console.log("Jawaban : " + nebak.jawaban + ` ( ${msg.from} )`);
            const regextebak = new RegExp("[^aeiou ]", "g");
            client.reply(msg.from, `*Tebak kalimat berikut ini*\n\nAnda mempunyai waktu ${config.game_time.kalimat} detik untuk menebak kalimat tersebut tersebut.\n\n*SENTENCE* :  ${nebak.soal}\n\n\`\`\`Sedang menunggu jawaban...\`\`\``)
                .then((obe) => {
                    // console.log(obe)
                    const objektebak = {
                        status: true,
                        name: msg.pushName,
                        number: msg.sender.jid,
                        remaining: "",
                        expired_on: moment(new Date())
                            .add(config.game_time.kalimat, "seconds")
                            .valueOf(),
                        message: obe,
                        data: {
                            kalimat: nebak.soal,
                            answer: nebak.jawaban,
                        },
                        listed: [],
                    };
                    fs.writeFileSync(
                        `./lib/database/tebak-kalimat/${msg.from}.json`,
                        JSON.stringify(objektebak, null, 2)
                    );
                });
        }
    }
}, {
})

// const { Aki } = require('aki-api');
// const region = 'id'
// const aki = new Aki({ region })


// cmd.on(['akinator'], ['game'], async (msg, { client, command }) => {
//     const reader = fs.readdirSync(`./lib/database/akinator/`);
//     if (reader.length > 0) return client.reply(msg, `Dalam Antrian Mohon Menunggu`)
//     if (reader.includes(msg.from + ".json")) {
//         client.reply(msg.from, { text: `Maaf sesi akinator sedang berlangsung` })
//             .then(() => {
//                 const datanya = JSON.parse(fs.readFileSync(`./lib/database/akinator/${msg.from}.json`));
//                 client.sendMessage(msg.from, { text: `Ini dia 👆👆👆` }, {
//                     quoted: datanya.message,
//                 });
//             })
//     } else {
//         global.y = setInterval(function () {
//             if (!fs.existsSync(`./lib/database/akinator/${msg.from}.json`)) return;
//             let db_tebak = JSON.parse(fs.readFileSync(`./lib/database/akinator/${msg.from}.json`));
//         }, 1000);
//         client.reply(msg.from, `Pikirkan Seorang Karakter Fiksi Atau Nyata. Saya Akan Menebaknya`)
//         functions.delay(100)
//         await aki.start()
//         client.sendButton(msg, { text: aki.question, buttonText: "Opsi Akinator" }, [{ title: "Ya", value: `!akibalas 0`, description: "Opsi Untuk Yes" }, { title: "Tidak", value: `!akibalas 1`, description: "Opsi Untuk No" }, { title: "Tidak Tau", value: `!akibalas 2`, description: "Opsi Untuk Don't Know" }, { title: "Mungkin", value: `!akibalas 3`, description: "Opsi Untuk Probably" }, { title: "Mungkin Tidak", value: `!akibalas 4`, description: "Opsi Untuk Probably Not" }])
//             .then((obe) => {
//                 const objektebak = {
//                     status: true,
//                     name: msg.pushName,
//                     number: msg.sender.jid,
//                     message: obe,
//                     listed: []
//                 };
//                 fs.writeFileSync(`./lib/database/akinator/${msg.from}.json`, JSON.stringify(objektebak, null, 2));
//             });
//     }
// }, {
// })


// cmd.on(['akibalas'], [], async (msg, { client, query, command }) => {
//     const datanya = JSON.parse(fs.readFileSync(`./lib/database/akinator/${msg.from}.json`));
//     if (datanya.number == msg.sender.jid) {
//         if (aki.progress >= 70 || aki.currentStep >= 78) {
//             await aki.win();
//             client.reply(msg, { image: aki.answers[0].absolute_picture_path, caption: `${aki.answers[0].name}\n${aki.answers[0].description}\nKemungkinan: ${aki.answers[0].proba}%` });
//             functions.delay(1000)
//             await aki.back()
//             clearInterval(global.y)
//             return fs.unlinkSync(`./lib/database/akinator/${msg.from}.json`);
//         } else {
//             await aki.step(query)
//             client.sendButton(msg, { text: `${aki.currentStep}. ${aki.question}`, buttonText: "Opsi Akinator" }, [{ title: "Ya", value: `!akibalas 0`, description: "Opsi Untuk Yes" }, { title: "Tidak", value: `!akibalas 1`, description: "Opsi Untuk No" }, { title: "Tidak Tau", value: `!akibalas 2`, description: "Opsi Untuk Don't Know" }, { title: "Mungkin", value: `!akibalas 3`, description: "Opsi Untuk Probably" }, { title: "Mungkin Tidak", value: `!akibalas 4`, description: "Opsi Untuk Probably Not" }, { title: "Nyerah", value: `!akinyerah`, description: "" }])
//         }
//     } else client.reply(msg, { text: `opsi ini hanya untuk @${datanya.number.split("@")[0]}`, mentions: [datanya.number] })


// }, {
// })

// cmd.on(['akinyerah'], [], async (msg, { client, query, command }) => {
//     await aki.back()
//     client.reply(msg, "cobalagi nanti ya")
//     clearInterval(global.y)
//     return fs.unlinkSync(`./lib/database/akinator/${msg.from}.json`);
// }, {
// })


const {
    Aki
} = require('aki-api');
// var { config } = require('process');
global.dbaki = {};
global.dbnext = {};

const emojis = [' 👍', ' 👎', ' ❔', ' 🤔', ' 🙄', ' ❌']
const akiimg = {
    "none": "https://raw.githubusercontent.com/adenosinetp10/Akinator-Bot/main/aki_pics/none.jpg",
    "win": "https://raw.githubusercontent.com/adenosinetp10/Akinator-Bot/main/aki_pics/aki_win.png",
    "defeat": "https://raw.githubusercontent.com/adenosinetp10/Akinator-Bot/main/aki_pics/aki_defeat.png",
    "ran": ["https://raw.githubusercontent.com/adenosinetp10/Akinator-Bot/main/aki_pics/aki_01.png", "https://raw.githubusercontent.com/adenosinetp10/Akinator-Bot/main/aki_pics/aki_02.png", "https://raw.githubusercontent.com/adenosinetp10/Akinator-Bot/main/aki_pics/aki_03.png", "https://raw.githubusercontent.com/adenosinetp10/Akinator-Bot/main/aki_pics/aki_04.png", "https://raw.githubusercontent.com/adenosinetp10/Akinator-Bot/main/aki_pics/aki_05.png"]
}
// cmd.on([''], [], async (msg, {
//     client, command, prefix
// }) => {
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
// })

cmd.on(['akinator', ' akiback', ' akistop'], ['game'], async (msg, {
    client, command, prefix
}) => {
    if (global.dbaki[msg.sender.jid]) {
        await client.sendAdReply(msg, { text: `Sesi Kamu Masih Aktif, Melanjutkan Sesi Sebelumnya` }, { title: msg.pushName, body: `Akinator by MechaBot `, thumbnail: akiimg.none, mediaType: 1, mediaUrl: "https://www.instagram.com/sgt_prstyo", sourceUrl: "https://www.instagram.com/sgt_prstyo" })
    } else {
        global.dbaki[msg.sender.jid] = new Aki({
            region: 'id'
        });
        await client.sendAdReply(msg, { text: `Pikirkan Seorang Karakter Fiksi Atau Nyata. Saya Akan Menebaknya` }, { title: msg.pushName, body: `Akinator by MechaBot `, thumbnail: akiimg.none, mediaType: 1, mediaUrl: "https://www.instagram.com/sgt_prstyo", sourceUrl: "https://www.instagram.com/sgt_prstyo" })
        await global.dbaki[msg.sender.jid].start()
    }
    return await client.sendButton(msg.from, {
        text: global.dbaki[msg.sender.jid].question, buttonText: "Pilih Jawaban Anda"
    }, global.dbaki[msg.sender.jid].answers.map((tr, index) => {
        return {
            title: tr + emojis[index], value: `!akijawab ${index}`
        };
    }));
});

cmd.on(['akijawab', 'akinext', 'akiback', 'akidone'], [], async (msg, {
    client, prefix, query, command
}) => {
    if (command == "akijawab") {
        if (!global.dbaki[msg.sender.jid]) return await client.reply(msg, `Tidak Ada Sesi Akinator Kamu, Mulai Dengan ${prefix}akinator`);
        await global.dbaki[msg.sender.jid].step(Number(query)).catch((err) => {
            client.reply(msg, `Maaf Session Ada Sudah Expired. silahkan mulai lagi`)
            delete global.dbaki[msg.sender.jid];
        })
        if (global.dbaki[msg.sender.jid].progress >= 70 || global.dbaki[msg.sender.jid].currentStep >= 78) {
            await global.dbaki[msg.sender.jid].win();
            // await client.sendAdReply(msg, { image: global.dbaki[msg.sender.jid].answers[0].absolute_picture_path, caption: `Saya Menebak\n\n- ${global.dbaki[msg.sender.jid].answers[0].name}\n- ${global.dbaki[msg.sender.jid].answers[0].description}\n- Kemungkinan: ${global.dbaki[msg.sender.jid].answers[0].proba}%` }, { title: msg.pushName, body: `Akinator by MechaBot `, thumbnail: akiimg.win, mediaType: 1, mediaUrl: "https://www.instagram.com/sgt_prstyo", sourceUrl: "https://www.instagram.com/sgt_prstyo" })
            await client.sendButton(msg, { image: global.dbaki[msg.sender.jid].answers[0].absolute_picture_path, caption: `Saya Menebak\n\n- ${global.dbaki[msg.sender.jid].answers[0].name}\n- ${global.dbaki[msg.sender.jid].answers[0].description}\n- Kemungkinan: ${global.dbaki[msg.sender.jid].answers[0].proba}%` }, [{ reply: "Sebelumnya", value: "!akiback" }, { reply: "Benar", value: "!akidone" }, { reply: "Bukan", value: "!akinext" }])
            global.dbnext[msg.sender.jid] = 0;
            // await functions.delay(150000);
            if (command != "akinext" || command != "akiback") {
                await functions.delay(90000);
                delete global.dbaki[msg.sender.jid];
            }
            // delete global.dbaki[msg.sender.jid];
            return 0;
        }
        return await client.sendButton(msg.from, {
            text: global.dbaki[msg.sender.jid].currentStep + ". " + global.dbaki[msg.sender.jid].question, footer: `Sessions: ${msg.pushName}\nAkinator MechaBot\b\b`, buttonText: "Pilih Jawaban Anda"
        }, global.dbaki[msg.sender.jid].answers.map((tr, index) => {
            return {
                title: tr + emojis[index], value: `!akijawab ${index}`
            };
        }));
    }

    if (command == "akinext") {
        if (!global.dbaki[msg.sender.jid]) return await client.reply(msg, `Tidak Ada Sesi Akinator Kamu, Mulai Dengan ${prefix}akinator`);
        try {
            ran = global.dbaki[msg.sender.jid].answers
            dbnext[msg.sender.jid]++
            let res = ran[dbnext[msg.sender.jid]]
            await client.sendButton(msg, { image: res.absolute_picture_path, caption: `${dbnext[msg.sender.jid]} Dari ${ran.length - 1}\n\nSaya Menebak\n\n- ${res.name}\n- ${res.description}\n- Kemungkinan: ${res.proba}%` }, [{ reply: "Benar" }, { reply: "Bukan", value: "!akinext" }])
        } catch (err) {
            client.sendButton(msg, { text: `Hmm Sepertinya Saya Belum Bisa Menebaknya.. Lanjutkan Pertanyaan?`, footer: `Sessions: ${msg.pushName}\nAkinator MechaBot\b\b` }, [{ reply: "Ya", value: "!akinext2" }, { reply: "Tidak", value: "akidone" }])
        }
    }
    if (command == "akiback") {
        if (!global.dbaki[msg.sender.jid]) return await client.reply(msg, `Tidak Ada Sesi Akinator Kamu, Mulai Dengan ${prefix}akinator`);
        await global.dbaki[msg.sender.jid].back()
        return await client.sendButton(msg.from, {
            text: global.dbaki[msg.sender.jid].question, buttonText: "Pilih Jawaban Anda"
        }, global.dbaki[msg.sender.jid].answers.map((tr, index) => {
            return {
                title: tr + emojis[index], value: `!akijawab ${index}`
            };
        }));
    }
    if (command == "akidone") {
        if (!global.dbaki[msg.sender.jid]) return await client.reply(msg, `Tidak Ada Sesi Akinator Kamu, Mulai Dengan ${prefix}akinator`);
        delete global.dbaki[msg.sender.jid];
    }

}, {
});

cmd.on(['dellaki', 'deleteaki', 'akistop', 'akidelet'], [], async (msg, {
    client, prefix, query
}) => {
    if (global.dbaki[msg.sender.jid] != undefined || msg.sender.admin != "admin") return await client.reply(msg, `Tidak Ada Sesi Akinator Kamu, Atau Kamu Bukan Admin, Mulai Dengan ${prefix}akinator`);
    delete global.dbaki[msg.sender.jid];
    client.reply(msg, `Berhasil Menghapus Session Kamu`)
    if (msg.sender.admin == "admin") {
        if (!msg.quotedMsg && !msg.mentionedJid) return client.reply(msg, `Tag User Atau Reply User Dengan Pesan !akidell`)
        if (msg.mentionedJid.length != 0) {
            delete global.dbaki[mentionedJid]
            client.reply(msg, `Berhasil Menghapus Session User`)
        } else if (msg.quotedMsg) {
            delete global.dbaki[msg.quotedMsg.sender.jid]
            client.reply(msg, `Berhasil Menghapus Session User`)
        }
    }
}, {
});

// cmd.on(['akiback', 'akinext', 'akidone'], [], async (msg, {
//     client, prefix, query, command
// }) => {
//     if (!global.dbaki[msg.sender.jid]) return await client.reply(msg, `Tidak Ada Sesi Akinator Kamu, Mulai Dengan ${prefix}akinator`);
//     if (command == "akinext") {
//         if (!global.dbaki[msg.sender.jid]) return await client.reply(msg, `Tidak Ada Sesi Akinator Kamu, Mulai Dengan ${prefix}akinator`);
//         try {
//             ran = global.dbaki[msg.sender.jid].answers
//             dbnext[msg.sender.jid]++
//             let res = ran[dbnext[msg.sender.jid]]
//             await client.sendButton(msg, { image: res.absolute_picture_path, caption: `${dbnext[msg.sender.jid]} Dari ${ran.length - 1}\n\nSaya Menebak\n\n- ${res.name}\n- ${res.description}\n- Kemungkinan: ${res.proba}%` }, [{ reply: "Benar" }, { reply: "Bukan", value: "!akinext" }])
//         } catch (err) {
//             client.sendButton(msg, { text: `Hmm Sepertinya Saya Belum Bisa Menebaknya.. Lanjutkan Pertanyaan?`, footer: `Sessions: ${msg.pushName}\nAkinator MechaBot\b\b` }, [{ reply: "Ya", value: "!akinext2" }, { reply: "Tidak", value: "akidone" }])
//         }
//     }
//     if (command == "akiback") {
//         if (!global.dbaki[msg.sender.jid]) return await client.reply(msg, `Tidak Ada Sesi Akinator Kamu, Mulai Dengan ${prefix}akinator`);
//         await global.dbaki[msg.sender.jid].back()
//         return await client.sendButton(msg.from, {
//             text: global.dbaki[msg.sender.jid].question, buttonText: "Pilih Jawaban Anda"
//         }, global.dbaki[msg.sender.jid].answers.map((tr, index) => {
//             return {
//                 title: tr + emojis[index], value: `!akijawab ${index}`
//             };
//         }));
//     }
//     if (command == "akidone") {
//         if (!global.dbaki[msg.sender.jid]) return await client.reply(msg, `Tidak Ada Sesi Akinator Kamu, Mulai Dengan ${prefix}akinator`);
//         delete global.dbaki[msg.sender.jid];
//     }

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
// }, {
// });

cmd.on(['akinext2'], [], async (msg, {
    client, command, prefix
}) => {
    if (!global.dbaki[msg.sender.jid]) return await client.reply(msg, `Tidak Ada Sesi Akinator Kamu, Mulai Dengan ${prefix}akinator`);
    await client.sendButton(msg.from, {
        text: global.dbaki[msg.sender.jid].currentStep + ". " + global.dbaki[msg.sender.jid].question, footer: `Sessions: ${msg.pushName}\nAkinator MechaBot\b\b`, buttonText: "Pilih Jawaban Anda"
    }, [{ title: "Iya", value: `!akijawab2 0` }, { title: "Tidak", value: `!akijawab2 1` }, { title: "Tidak tahu", value: `!akijawab2 2` }, { title: "Mungkin", value: `!akijawab2 3` }, { title: "Mungkin tidak", value: `!akijawab2 4` }]);
});

cmd.on(['akijawab2',], [], async (msg, {
    client, prefix, query
}) => {
    if (!global.dbaki[msg.sender.jid]) return await client.reply(msg, `Tidak Ada Sesi Akinator Kamu, Mulai Dengan ${prefix}akinator`);
    await global.dbaki[msg.sender.jid].step(Number(query)).catch((err) => {
        client.reply(msg, `Maaf Session Ada Sudah Expired. silahkan mulai lagi`)
        delete global.dbaki[msg.sender.jid];
    })
    return await client.sendButton(msg.from, {
        text: global.dbaki[msg.sender.jid].currentStep + ". " + global.dbaki[msg.sender.jid].question, footer: `Sessions: ${msg.pushName}\nAkinator MechaBot\b\b`, buttonText: "Pilih Jawaban Anda"
    }, global.dbaki[msg.sender.jid].answers.map((tr, index) => {
        return {
            title: tr + emojis[index], value: `!akijawab ${index}`
        };
    }));
}, {
    query: "Masukan Query"
});