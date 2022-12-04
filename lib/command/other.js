process.on("uncaughtException", console.log);
const fs = require("fs")
const { getFilesize, ImageSearch } = require("../scrapper/func");
const google = require('google-it')
const gp = require('../scrapper/gempabumi-bmkg')
const { wiki, brainly, crawl } = require("../scrapper/crawler");
const { wiki2 } = require("../scrapper/wikipedia");
const { chord } = require("../scrapper/chord");
const { config } = require("process");
const { lirik } = require("../scrapper/lirik")
const util = require('util');

cmd.on(['google', 'search', "search2", 'wikipedia', 'wiki', 'crawl'], ['other'], async (msg, { client, query, command, text }) => {
    if (command == "google" || command == "search") {
        google({ query: query, disableConsole: true })
            .then((results) => {
                // return console.log(results)
                let captserch = `_*Hasil Pencarian dari*_ ${query}\n`;
                for (let i = 0; i < results.length; i++) {
                    captserch += `\n==================================\n\n`;
                    captserch += `\n*Judul* : ${results[i].title}\n*Deskripsi* : ${results[i].snippet}\n*Link* : ${results[i].link}\n`;
                }
                client.reply(msg, captserch);
            })
            .catch((e) => {
                ERRLOG(e);
                client.reply("6285215319934@s.whatsapp.net", e);
            });
    }
    if (command == "wikipedia" || command == "wiki") {
        ImageSearch(query.includes('|') ? query.split('|')[0] : query)
            .then((result) => {
                let acak = Math.floor(Math.random() * result.length);
                wiki2(query.includes('|') ? query.split('|')[0] : query, query.includes('|') ? query.split('|')[1].replace(/ /g, '') : 'id')
                    .then(rest => {
                        client.reply(
                            msg,
                            {
                                image: result[acak],
                                caption: `*[ WIKIPEDIA : ${rest.title} ]*\n\n${rest.description}`
                            }
                        )
                    })
                    .catch(e => {
                        wiki2(query.includes('|') ? query.split('|')[0] : query, query.includes('|') ? query.split('|')[1].replace(/ /g, '') : 'id')
                            .then(rest => {
                                client.reply(
                                    msg,
                                    `*[ WIKIPEDIA : ${rest.title} ]*\n\n${rest.description}`
                                )
                            }).catch(e => {
                                console.log(e)
                                client.reply(msg, `Kesalahan saat mengambil Data`)
                            })
                        console.log(e)
                        client.reply(msg, `Kesalahan saat mengambil gambar!. Hasil Akan dikirim Tanpa Gambar`)
                    })
            })
    }
    if (command == "crawl" || command == "search2") {
        crawl(query).then((data) => {
            let caption = `*Hasil pencarian dari ${query}*`;
            for (let i = 0; i < data.length; i++) {
                caption += `\n*Urutan* : ${i + 1}. *${data[i].title}*
*Url* : ${data[i].url}
*Desc* : ${data[i].desc}\n`;
            }
            for (let j = 0; j < data.length; j++) {
                caption += `(#)${data[j].id}`;
            }
            client.reply(msg, caption);
        }).catch(e => {
            console.log(e)
            client.reply(msg, `Kesalahan saat mengambil Data`)
        })
    }
}, {
    query: "Masukan query",
    param: functions.needed('query')
})

cmd.on(['chord', 'kuncigitar'], ['other'], async (msg, { client, query }) => {
    await chord(query).then((data) => {
        client.reply(msg, `*${data.title.replace("&#8211;", "-")}*\n${data.chord}`);
    }).catch((e) => {
        client.reply(msg, `Cho rd lagu tersebut tidak ditemukan!`);
    });
}, {
    query: "Masukan Judul Lagu",
    param: functions.needed('query/judul lagu')
})

cmd.on(['lirik', 'liriklagu'], ['other'], async (msg, { client, query }) => {
    
    lirik(query).then((rest) => {
        if (rest.lyrics == '') return balas(from, `Tidak ditemukan lirik pada lagu (${rest.title} - ${rest.artist}), coba masukan dengan nama artisnya!`)
        let captionLirik = `*[ ${rest.title} - ${rest.artist} ]*\n\n` + rest.lyrics
        client.reply(msg, { image: rest.img, caption: captionLirik })
    })
        .catch(
            (e) => {
                client.reply(msg, `lgu tidak ditemukan coba masukan dengan nama artisnya!`)
            }
        );
}, {
    query: "Masukan Judul Lagu/lirik",
    param: functions.needed('query/judul lagu/lirik')
})

cmd.on(['vote', 'pool'], ['other'], async (msg, { client, query }) => {
    let title = query.split("|")[0]
    let value = query.split("|")[1]
    value = value.split(",").map(tr => { return { optionName: tr.trim() } })
    return client.sendMessageFromContent(msg.from, {
        pollCreationMessage: {
            selectableOptionsCount: value.length,
            name: title,
            options: value
        }
    })
}, {
    query: "Masukan Vaule\n contoh .vote Owner Ganteng?| ya, ganteng, benar semua",
    param: functions.needed('query')
})

cmd.on(['infogempa', 'bmkg', 'gempa'], ['other'], async (msg, { client }) => {
    
    gp.getGempa()
        .then(rest => {
            client.reply(msg, {
                image: rest.gambar, caption: `*INFO GEMPA 🌍*
🕐 *Waktu* : ${rest.waktu}
🌋 *Magnitudo* : ${rest.magnitudo}
🌆 *Kedalaman* : ${rest.kedalaman}
📌 *Koordinat* : ${rest.koordinat}
🏙️ *Lokasi* : ${rest.lokasi}
🌊 *Potensi Tsunami* : ${rest.tsunami}
         `})
        })
        .catch(() => client.reply(msg, `Gagal Mendapatkan data gempa!`))
}, {
})

cmd.on(['walpaper', 'randomwalpaper', 'unsplash'], ['other'], async (msg, { client }) => {
    let bg = JSON.parse(require("fs").readFileSync("./src/local/unsplash.json"));
    const wallpaper = bg[Math.floor(Math.random() * bg.length)];
    const wp_download = await require("axios").get(
        `https://tinyurl.com/api-create.php?url=${wallpaper.download_url}`
    );
    client.reply(msg, { image: wallpaper.download_url, caption: `*Random Wallpaper*\n\n*Author* : ${wallpaper.author}\n*Scale* : ${wallpaper.width}x${wallpaper.height}\n*High Res* : ${wp_download.data}\n\n_Source : ${wallpaper.url}_` });
}, {
})

cmd.on(['cecan', 'cewek', 'cewe', 'cewecantik', 'cogan', 'cowok', 'cowo', 'cowoganteg'], ['other'], async (msg, { client, command }) => {
    if (command == "cecan" || command == "cewe" || command == "cewecantik") {
        const cecan = JSON.parse(require("fs").readFileSync("./src/local/cecan.json"));
        const ciwi = Math.floor(Math.random() * cecan.length);
        client.reply(msg, { image: cecan[ciwi], caption: `Ciwi nya ${msg.pushName}` });
    }
    if (command == "cogan" || command == "cowok" || command == "cowoganteng") {
        const cogan = JSON.parse(require("fs").readFileSync("./src/local/cogan.json"));
        const cuwu = Math.floor(Math.random() * cogan.length);
        client.reply(msg, { image: cogan[cuwu], caption: `Cuwu nya ${msg.pushName}` });
    }
}, {
})

cmd.on(['katabijak', 'bijak', 'fact', 'facts', 'fakta', 'pantun', 'katailham', 'dilan', 'katadilan', 'bucin', 'hackerbucin', 'hekerbucin', 'jokes', 'meme', 'couple'], ['other'], async (msg, { client, command }) => {
    if (command == "katabijak" || command == "bijak") {
        const fakstu = fs
            .readFileSync("./lib/random/katabijax.txt", "utf-8")
            .split("\n");
        client.reply(msg, `${fakstu[Math.floor(Math.random() * fakstu.length + 1)]}`);
    }
    if (command == "fact" || command == "facts" || command == "fakta") {
        const faks = fs
            .readFileSync("./lib/random/faktaunix.txt", "utf-8")
            .split("\n");
        client.reply(msg, `*FACTS* : ${faks[Math.floor(Math.random() * faks.length + 1)]}`
        );
    }
    if (command == "pantun") {
        const fakstpu = fs.readFileSync("./lib/random/pantun.txt", "utf-8").split("\n");
        const pantunn = fakstpu[Math.floor(Math.random() * fakstpu.length + 1)].split(" aruga-line ");
        let panteune = "";
        for (var i = 0; i < pantunn.length; i++) {
            panteune += `${pantunn[i].replace(" \r\n", "")}\n`;
        }
        console.log({
            res: panteune,
        });
        client.reply(msg, `${panteune.replace("\n \n", "")}`);
    }

    if (command == "katailham") {
        hasil = require("../random/katailham.json")[Math.floor(Math.random() * (require("../random/katailham.json").length))]
        hasilnye = '*' + hasil + '*'
        client.reply(msg, hasilnye)
    }
    if (command == "katadilan" || command == "dilan") {
        hasil = require("../random/katadilan.json")[Math.floor(Math.random() * (require("../random/katadilan.json").length))]
        hasilnye = '*' + hasil + '*\n~ *Dilan*'
        client.reply(msg, hasilnye)
    }
    if (command == "hackerbucin" || command == "hekerbucin") {
        hasil = require("../random/hackerbucin.json")[Math.floor(Math.random() * (require("../random/hackerbucin.json").length))]
        hasilnye = '*' + hasil + '*'
        client.reply(msg, hasilnye)
    }
    if (command == "bucin") {
        hasil = require("../random/bucin.json")[Math.floor(Math.random() * (require("../random/bucin.json").length))]
        hasilnye = '*' + hasil + '*'
        client.reply(msg, hasilnye)
    }
    if (command == "jokes" || command == "meme") {
        // let dark = require("../random/darkjokes")
        // jsonData = JSON.parse(dark);
        // randIndex = Math.floor(Math.random() * jsonData.length);
        // randKey = jsonData[randIndex];
        // img = await getBuffer(randKey.result)
        let rand = require("../random/darkjokes.json")[Math.floor(Math.random() * require("../random/darkjokes.json").length)]
        client.sendButton(msg, { image: rand.result, caption: "Awokawokawaok", footer: config.botname }, [{ reply: "Next", value: ".meme" }])
    }
    if (command == "couple" || command == "ppcouple") {
        let random = require("../random/couple")[Math.floor(Math.random() * require("../random/couple").length)]
        client.reply(msg, { image: random.male, caption: "Cowonya" })
        client.reply(msg, { image: random.female, caption: "Cewenya" })
    }
}, {
})

cmd.on(['rate', 'nilai'], ['other'], async (msg, { client }) => {
    client.reply(msg, `Presentase yang anda dapatkan adalah *${Math.floor(Math.random() * 101)}%*`
    );
}, {
})

cmd.on(['apakah', 'benarkah'], ['other'], async (msg, { client }) => {
    let jawabna = [
        "Kayaknya ngga",
        "Iya",
        "Bisa jadi",
        "Mungkin",
        "Iyah emang",
        "Hemm gatau",
        "Lahh nanya?",
        "Betul tu",
        "Bener banget 1000000%",
    ];
    client.reply(msg, jawabna[Math.floor(Math.random() * jawabna.length)]);
}, {
})

cmd.on(['fixaudio', 'audiofix'], ['maker'], async (msg, { client }) => {
    let { fixAudio } = require("../scrapper/converter")
    let down = msg.isMedia ? msg.downloadMsg : msg.quotedMsg.downloadMsg
    let apakahaudio = msg.message.audioMessage
    let apakahaudiotag = msg.quotedMsg && msg.quotedMsg.message.audioMessage
    let buff = await down()
    fixAudio(buff).then((rest) => {
        client.reply(msg, { audio: rest })
    }).catch(() => {
        client.reply(msg, { text: `Maaf terjadi kesalahan!` })
    })
}, {
    _media: true,
    param: functions.needed('tag media'),
    sensitive: true
})

cmd.on(['artinama'], ['other'], async (msg, { client, query }) => {
    let Axios = require("axios")
    let cheerio = require("cheerio")
    Axios.get(`https://www.primbon.com/arti_nama.php?nama1=${query}&proses=+Submit%21+`).then(({ data }) => {
        const $ = cheerio.load(data);
        const result = $("#body").text().split("Nama:")[0].split("Nama")[1];
        return client.reply(msg, `${result}`)
    })
        .catch(
            (e) =>
                client.reply(msg, `Nama Tidak Ditemukan!`) &&
                client.reply(config.ownerNumber, util.format(e) + "\nLirik")
        );
}, {
    query: "Masukan Nama Kamu",
    param: functions.needed('query')
})



cmd.on(["viewonce"], ['message'], async (msg, {
    client, quotedMsg
}) => {
    if (!quotedMsg.realType == "viewOnceMessage") return client.reply(msg, {
        text: "Pesan Tersebut Bukan View Once"
    })
    let buf = await quotedMsg.downloadMsg()
    let res = buf.mime.includes('image') ? 'image' : 'video'
    return await client.reply(msg, {
        [res]: buf.buffer
    })
}, {
    quoted: "Tag Pesan Yang Terdapat View Once",
    param: "<tag pesan>"
})

