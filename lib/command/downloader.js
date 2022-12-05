process.on("uncaughtException", console.log);
const Axios = require("axios")
const { yts } = require("../scrapper/youtube")
const { ytdl2 } = require("../scrapper/youtube")
const { searchApk, getApk, getApkReal, searchApkpure, sizer } = require("../scrapper/apk")
const { zippyDl } = require("../scrapper/zippyshare")
const { gdriveDl } = require("../scrapper/gdrive")
const getLink = require("mediafire-link")
const mega = require("megajs")
const ttdl = require("tiktok-down")
let { list, head, line } = config.unicode

// YOUTUBE
cmd.on(['yt', 'yts', 'ytsearch', 'youtubesearch', 'ytmp4', 'ytvid', 'ytvideo', 'ytmp4doc', 'ytmp3', 'ytmusic', 'ytmp3doc', 'play', 'lagu', 'song'], ['download'], async (msg, {
    client, query, prefix, command, urls
}) => {
    if (command == "yts" || command == "ytsearch" || command == "youtubesearch") {
        try {
            let yt = await yts(query)
            let ytsr = yt.result
            let captions = `*${head}${line.repeat(4)}${list} Youtube Search*
_*Pencarian Ditemukan*_\n\n`
            for (let tr of ytsr) {
                captions += functions.parseResult(tr, { body: "*➛ %key*: %value", footer: `${head}${line.repeat(3)}${list}`, headers: "\n" }) + "\n\n"
            }
            // return await client.reply(msg, captions + `*MechaBot*`)
            await client.sendAdReply(msg.from, { text: captions + `*MechaBot*` }, { title: ytsr.title, description: config.botname, matchedText: ytsr[0].url, canonicalUrl: global.linkgcme, thumbnail: ytsr[0].thumbnail, previewType: 2, renderLargerThumbnail: true, mediaType: 1 })
        } catch (err) {
            client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Tersebut\n\n` + err)
        }
    }


    if (command == "yt" || command == "ytmp4" || command == "ytvid" || command == "ytvideo") {
        if (!urls) return client.reply(msg, `Masukkan Link Youtube Yang ingin diunduh`)
        if (!urls && !urls[0].includes('youtu')) return client.reply(msg, `*Bruh, Masukkan Link Youtube nya,*\n*_Bukan Link! : ${query}_*`)
        if (urls && !urls[0].includes('youtu')) return client.reply(msg, `*Bruh, Masukkan Link Youtube nya,*\n*_Bukan Link! : ${query}_*`)
        try {
            if (!urls || !urls[0].includes('youtu')) return client.reply(msg, `Masukkan Link Youtube Yang ingin diunduh`)
            if (urls[0].includes("/shorts/")) {
                let data = await ytdl2(urls[0], "mp4", "480")
                captions = `*_${head}${line.repeat(4)}${list} Youtube Shorts Downloader_*
Data Berhasil Didapatkan:\n`
captions += `
*Title:* ${data.title}
*Type:* ${data.type}
*Quality:* ${data.quality}
*Size:* ${data.filesize}
${head}${line.repeat(3)}${list}

*${config.botname}*`
let filename = "Convert By: MechaBot" + data.title
                client.sendButton(msg, { video: data.download.replace("https://", "http://"), fileName: filename, content: captions, footer: config.botname }, [{ reply: "Document", value: `.ytmp4doc ${urls[0]}` }, { reply: "Audio", value: `.ytmp3 ${urls[0]}` }])
            }
            if (urls[0].includes("/shorts/")) return
            let play = await yts(urls[0]);
            if (play.length === 0) return client.reply(msg, `${urls[0]} tidak dapat ditemukan!`);
            let sul = play.result[0].url
            let data = await ytdl2(sul, "mp4", "360")
            captions =
                `*_${head}${line.repeat(4)}${list} Youtube Downloader_*
  Data Berhasil Didapatkan:\n`
            captions += functions.parseResult(play.result[0], { body: "*➛ %key*: %value", footer: `${head}${line.repeat(3)}${list}`, headers: "\n" })
            let filename = "Convert By: MechaBot" + data.title
            client.sendButton(msg, { video: data.download.replace("https://", "http://"), fileName: data.title, content: captions, footer: config.botname }, [{ reply: "Document", value: `.ytmp4doc ${sul}` }, { reply: "Audio", value: `.ytmp3 ${sul}` }])
        } catch (err) {
            client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Tersebut\n\n` + err)
        }
    }

    if (command == "ytmp4doc" || command == "ytmp3doc") {
        try {
            if (!urls) return client.reply(msg, `Masukkan Link Youtube Yang ingin diunduh`)
            if (!urls && !urls[0].includes('youtu')) return client.reply(msg, `*Bruh, Masukkan Link Youtube nya,*\n*_Bukan Link! : ${query}_*`)
            if (urls && !urls[0].includes('youtu')) return client.reply(msg, `*Bruh, Masukkan Link Youtube nya,*\n*_Bukan Link! : ${query}_*`)
            
            if (command == "ytmp4doc") {
                if (urls[0].includes("/shorts/")) {
                    let data = await ytdl2(urls[0], "mp4", "480")
                    captions = `*_${head}${line.repeat(4)}${list} Youtube Shorts Downloader_*
Data Berhasil Didapatkan:\n`
    captions += `
*Title:* ${data.title}
*Type:* ${data.type}
*Quality:* ${data.quality}
*Size:* ${data.filesize}
${head}${line.repeat(3)}${list}
    
*${config.botname}*`
    let filename = "Convert By: MechaBot" + data.title
                    return client.sendAdReply(msg, { document: data.download.replace("https://", "http://"), fileName: filename }, { title: data.title, body: data.type + ` || ` + data.quality + ` || ` + data.filesize, thumbnail: data.thumb, meidaType: 1, mediaUrl: urls[0], sourceUrl: urls[0] })
                }
                if (urls[0].includes("/shorts/")) return
                let play = await yts(urls[0]);
            if (play.length === 0) return client.reply(msg, `${urls[0]} tidak dapat ditemukan!`);
            let sul = play.result[0].url
                let data = await ytdl2(sul, "mp4", "360")
                let filename = "Convert By: MechaBot" + data.title
                return client.sendAdReply(msg, { document: data.download.replace("https://", "http://"), fileName: filename }, { title: data.title, body: data.type + ` || ` + data.quality + ` || ` + data.filesize, thumbnail: play.result[0].thumbnail, meidaType: 1, mediaUrl: sul, sourceUrl: sul })
            }
            if (command == "ytmp3doc") {
                if (urls[0].includes("/shorts/")) {
                    let data = await ytdl2(urls[0], "mp3", "128")
                    captions = `*_${head}${line.repeat(4)}${list} Youtube Shorts Downloader_*
Data Berhasil Didapatkan:\n`
    captions += `
*Title:* ${data.title}
*Type:* ${data.type}
*Quality:* ${data.quality}
*Size:* ${data.filesize}
${head}${line.repeat(3)}${list}
    
*${config.botname}*`
    let filename = "Convert By: MechaBot" + data.title
                    return client.sendAdReply(msg, { document: data.download.replace("https://", "http://"), fileName: filename }, { title: data.title, body: data.type + ` || ` + data.quality + ` || ` + data.filesize, thumbnail: data.thumb, meidaType: 1, mediaUrl: urls[0], sourceUrl: urls[0] })
                }
                if (urls[0].includes("/shorts/")) return
                let play = await yts(urls[0]);
            if (play.length === 0) return client.reply(msg, `${urls[0]} tidak dapat ditemukan!`);
            let sul = play.result[0].url
                let data = await await ytdl2(sul, "mp3", "128")
                let filename = "Convert By: MechaBot" + data.title
                return client.sendAdReply(msg, { document: data.download.replace("https://", "http://"), fileName: filename }, { title: data.title, body: data.type + ` || ` + data.quality + ` || ` + data.filesize, thumbnail: play.result[0].thumbnail, meidaType: 1, mediaUrl: sul, sourceUrl: sul })
            }
        } catch (err) {
            client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Tersebut\n\n` + err)
        }
    }

    if (command == "ytmp3" || command == "ytmusic" || command == "ytmp3doc") {
        if (!urls) return client.reply(msg, `Masukkan Link Youtube Yang ingin diunduh`)
        if (!urls && !urls[0].includes('youtu')) return client.reply(msg, `*Bruh, Masukkan Link Youtube nya,*\n*_Bukan Link! : ${query}_*`)
        if (urls && !urls[0].includes('youtu')) return client.reply(msg, `*Bruh, Masukkan Link Youtube nya,*\n*_Bukan Link! : ${query}_*`)
        try {
            if (!urls[0] || !urls[0].includes('youtu')) return client.reply(msg, `Masukkan Link Youtube Yang ingin diunduh`)
            if (urls[0].includes("/shorts/")) {
                let data = await ytdl2(urls[0], "mp3", "128")
                captions = `*_${head}${line.repeat(4)}${list} Youtube Shorts Downloader_*
Data Berhasil Didapatkan:\n`
captions += `
*Title:* ${data.title}
*Type:* ${data.type}
*Quality:* ${data.quality}
*Size:* ${data.filesize}
${head}${line.repeat(3)}${list}

*${config.botname}*`
let filename = "Convert By: MechaBot" + data.title
                return client.sendAdReply(msg, { audio: data.download.replace("https://", "http://"), fileName: filename }, { title: data.title, body: data.type + ` || ` + data.quality + ` || ` + data.filesize, thumbnail: data.thumb, meidaType: 1, mediaUrl: urls[0], sourceUrl: urls[0] })
            }
            if (urls[0].includes("/shorts/")) return
            let play = await yts(urls[0]);
            if (play.length === 0) return client.reply(msg, `${urls[0]} tidak dapat ditemukan!`);
            let sul = play.result[0].url
            let data = await await ytdl2(sul, "mp3", "128")
            captions =
                `*_${head}${line.repeat(4)}${list} Youtube Downloader_*
  Data Berhasil Didapatkan:\n`
            captions += functions.parseResult(play.result[0], { body: "*➛ %key*: %value", footer: `${head}${line.repeat(3)}${list}`, headers: "\n" })
            let filename = "Convert By: MechaBot" + data.title
            client.sendButton(msg, { image: play.result[0].thumbnail, content: captions + "\n\n_Mohon Tunggu Sebentar_", footer: config.botname }, [{ reply: "Video", value: `.ytmp4 ${sul}` }, { reply: "Document", value: `.ytmp3doc ${sul}` }])
            await client.sendAdReply(msg, { audio: data.download.replace("https://", "http://"), fileName: filename }, { title: data.title, body: data.type + ` || ` + data.quality + ` || ` + data.filesize, thumbnail: play.result[0].thumbnail, meidaType: 1, mediaUrl: sul, sourceUrl: sul })
        } catch (err) {
            client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Tersebut\n\n` + err)
        }
    }

    if (command == "play" || command == "lagu" || command == "song") {
        try {
            let play = await yts("song" + query);
            if (play.length === 0) return client.reply(msg, `Lagu tidak dapat ditemukan!`);
            let sul = play.result[0].url
       let data = await await ytdl2(sul, "mp3", "128")
            let filename = "Convert By: MechaBot" + data.title
            await client.sendAdReply(msg, { audio: data.download.replace("https://", "http://"), fileName: filename }, { title: data.title, body: data.type + ` || ` + data.quality + ` || ` + data.filesize, thumbnail: play.result[0].thumbnail, meidaType: 2, mediaUrl: sul, sourceUrl: sul })
        } catch (err) {
            client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Lagu Tersebut\n\n` + err)
        }
    }

}, {
    query: "Masukkan Sebuah Link | Enter A Link",
    wait: "*WAIT! | Mohon Tunggu Sebentar..*",
    param: functions.needed('query/link')
})

cmd.on(['tt', 'tiktok', 'ttdl', 'ttdownloader', 'tiktokdownloader', 'ttaudio', 'tiktokaudio'], ['download'], async (msg, {
    client, query, urls, command
}) => {
    if (!urls) return client.reply(msg, `Masukkan Link Tiktok Yang ingin diunduh`)
    if (!urls && !urls[0].includes('tiktok')) return client.reply(msg, `*Bruh, Masukkan Link Tiktok nya,*\n*_Bukan Link! : ${query}_*`)
    if (urls && !urls[0].includes('tiktok')) return client.reply(msg, `*Bruh, Masukkan Link Tiktok nya,*\n*_Bukan Link! : ${query}_*`)
    // let ttdl = require("tiktok-down")
    // let { tiktokdownload } = require("tiktok-scraper-without-watermark")

    if (command == "tt" || command == "tiktok" || command == "ttdl" || command == "ttdownloader" || command == "tiktokdownloader") {
        try {
            let urel = urls[0].split("https://vtiktok.com")[1].split("/")[1]
            let option = {
                url: `https://vt.tiktok.com/${urel}`,
                noWaterMark: true, // set true, If You Want No WaterMark
                checkUpdate: false, // set true, If You Want Update Notification 
                userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.33"
            }
            let data = await ttdl(option)
            caption = `*_${head}${line.repeat(4)}${list} Tiktok Downloader_*
Data Berhasil Didapatkan:

*VideoId:* ${data.video.id}
*Title:* ${data.video.signature}
*Like:* ${data.video.heartCount}
*Coments:* ${data.video.commentCount}
*Share:* ${data.video.shareCount}
*Views:* ${data.video.viewCount}
*Duration:* ${data.video.duration} _Second_
*Quality:* ${data.video.quality}

*Author:* ${data.owner.author}
*Id:* ${data.owner.uniqueID}
*Desc:* ${data.owner.signature}
*Private:* ${data.owner.privateAccount ? "Yess" : "No"}
*Videos:* ${data.owner.videoCount}
*Likes:* ${data.owner.heartCount}
*Follower:* ${data.owner.followerCount}
*Following:* ${data.owner.followingCount}
${head}${line.repeat(3)}${list}

*${config.botname}*`
            // let data = await tiktokdownload(`https://vt.tiktok.com/${urel}`)
            await client.sendButton(msg, { video: data.video.url, caption: caption, footer: `Tik-tok Downloader MechaBot` }, [{ reply: "Audio", value: `.ttaudio ${urls[0]}` }])
        } catch (err) {
            try {
                let option = {
                    url: urls[0],
                    noWaterMark: true, // set true, If You Want No WaterMark
                    checkUpdate: false, // set true, If You Want Update Notification
                    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.33"
                }
                let data = await ttdl(option)
                caption = `*_${head}${line.repeat(4)}${list} Tiktok Downloader_*
Data Berhasil Didapatkan:

*VideoId:* ${data.video.id}
*Title:* ${data.video.signature}
*Like:* ${data.video.heartCount}
*Coments:* ${data.video.commentCount}
*Share:* ${data.video.shareCount}
*Views:* ${data.video.viewCount}
*Duration:* ${data.video.duration} _Second_
*Quality:* ${data.video.quality}

*Author:* ${data.owner.author}
*Id:* ${data.owner.uniqueID}
*Desc:* ${data.owner.signature}
*Private:* ${data.owner.privateAccount ? "Yess" : "No"}
*Videos:* ${data.owner.videoCount}
*Likes:* ${data.owner.heartCount}
*Follower:* ${data.owner.followerCount}
*Following:* ${data.owner.followingCount}
${head}${line.repeat(3)}${list}

*${config.botname}*`
                // let data = await tiktokdownload(urls[0])
                await client.sendButton(msg, { video: data.video.url, caption: caption, footer: `Tik-tok Downloader MechaBot` }, [{ reply: "Audio", value: `.ttaudio ${urls[0]}` }])
            } catch (err) {
                client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Lagu Tersebut\n\n` + err)
                console.log(err)
            }
        }
    }

    if (command == "ttaudio" || command == "tiktokaudio") {
        try {
            let urel = urls[0].split("https://vt.tiktok.com")[1].split("/")[1]
            let option = {
                url: `https://vt.tiktok.com/${urel}`,
                userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.33"
            }
            let data = await ttdl(option)
            // let data = await tiktokdownload(`https://vt.tiktok.com/${urel}`)
            await client.sendAdReply(msg, { audio: data.audio.url }, { title: data.audio.name, body: `Audio Id: ${data.audio.id}\nConvert By: ${config.botname}`, thumbnail: data.audio.thumb, meidaType: 1, mediaUrl: "https://instagram.com/sgt_prstyo", sourceUrl: "https://instagram.com/sgt_prstyo" })
            // await client.reply(msg, { audio: data.audio })
        } catch (err) {
            try {
                let option = {
                    url: urls[0],
                    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.33"
                }
                let data = await ttdl(option)
                await await client.sendAdReply(msg, { audio: data.audio.url }, { title: data.audio.name, body: `Audio Id: ${data.audio.id}\nConvert By: ${config.botname}`, thumbnail: data.audio.thumb, meidaType: 1, mediaUrl: "https://instagram.com/sgt_prstyo", sourceUrl: "https://instagram.com/sgt_prstyo" })
                // let data = await tiktokdownload(urls[0])
                // awaitclient.reply(msg, { audio: data.audio })
            } catch (err) {
                client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Lagu Tersebut\n\n` + err)
            }
        }
    }
}, {
    query: "Masukkan Url | Enter A Url",
    wait: "*WAIT! | Mohon Tunggu Sebentar...*",
    param: functions.needed('query/Url')
})

cmd.on(['zippy', 'zippydl', 'zippyshare', 'zippysharedl', 'zippysharedownloader'], ['download'], async (msg, {
    client, query, urls
}) => {
    if (!urls) return client.reply(msg, `Masukkan Link Zippyshare Yang ingin diunduh`)
    if (!urls && !urls[0].includes('zippy')) return client.reply(msg, `*Bruh, Masukkan Link Zippyshare nya,*\n*_Bukan Link! : ${query}_*`)
    if (urls && !urls[0].includes('zippy')) return client.reply(msg, `*Bruh, Masukkan Link Zippyshare nya,*\n*_Bukan Link! : ${query}_*`)
    try {
        let res = await zippyDl(urls[0])
        // if (res.result.name.includes(".mp4")) 
        // let formatter = res.result.name.split("].")[1]
        return client.sendAdReply(msg, { document: res.result.download, fileName: res.result.name, caption: `*ZippyShare Downloader*\n\n*Title:* ${res.result.name}\n*Size*: ${res.result.size}\n*Uploadded:* ${res.result.upload} \n\n *MechaBot*` }, { title: res.result.name, body: res.result.size + "||" + res.result.upload, thumbnail: config.mecha_image, mediaType: 1, mediaUrl: "https://Instagram.com/sgt_prstyo", sourceUrl: "https://Instagram.com/sgt_prstyo" })
    } catch (err) {
        client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Lagu Tersebut\n\n` + err)
    }
}, {
    query: "Masukkan Url | Enter A Url",
    wait: "*WAIT! | Mohon Tunggu Sebentar...*",
    param: functions.needed('query/Url')
})

cmd.on(['gdrive', 'gdrivedl', 'googledrive', 'googledrivedl', 'googledrivedownloader'], ['download'], async (msg, {
    client, query, urls
}) => {
    if (!urls) return client.reply(msg, `Masukkan Link Google Drive Yang ingin diunduh`)
    if (!urls && !urls[0].includes('drive.google')) return client.reply(msg, `*Bruh, Masukkan Link Google Drive nya,*\n*_Bukan Link! : ${query}_*`)
    if (urls && !urls[0].includes('drive.google')) return client.reply(msg, `*Bruh, Masukkan Link Google Drive nya,*\n*_Bukan Link! : ${query}_*`)
    try {
        let res = await gdriveDl(urls[0])
        // if (res.result.name.includes(".mp4")) 
        // let formatter = res.result.name.split("].")[1]
        return client.sendAdReply(msg, { document: res.result.download, fileName: res.result.name, mimetype: res.result.mimetype, caption: `*Google Drive Downloader*\n\n*Title:* ${res.result.name}\n*Size*: ${res.result.size}\n*Uploadded:* ${res.result.upload} \n\n *MechaBot*` }, { title: res.result.name, body: res.result.size, thumbnail: config.mecha_image, mediaType: 1, mediaUrl: "https://www.instagram.com/sgt_prstyo", sourceUrl: "https://www.instagram.com/sgt_prstyo" })
    } catch (err) {
        client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Lagu Tersebut\n\n` + err)
    }
}, {
    query: "Masukkan Url | Enter A Url",
    wait: "*WAIT! | Mohon Tunggu Sebentar...*",
    param: functions.needed('query/Url')
})

cmd.on(['mediafire', 'mediafiredl', 'mediafiredownloader'], ['download'], async (msg, {
    client, query, urls
}) => {
    if (!urls) return client.reply(msg, `Masukkan Link Mediafire Yang ingin diunduh`)
    if (!urls && !urls[0].includes('mediafire')) return client.reply(msg, `*Bruh, Masukkan Link Mediafire nya,*\n*_Bukan Link! : ${query}_*`)
    if (urls && !urls[0].includes('mediafire')) return client.reply(msg, `*Bruh, Masukkan Link Mediafire nya,*\n*_Bukan Link! : ${query}_*`)
    try {
        let res = await getLink(urls[0])
        return client.sendButton(msg, { document: res, fileName: res.split("mediafire.com/")[1].split("/")[2], caption: `*Mediafire Downloader*\n\n*Title:* ${res.split("mediafire.com/")[1].split("/")[2]}\n\n_Note: jikalau File Tidak Bisa Dibuka Silahkan Download Manual_ \n\n *MechaBot*` }, [{ url: "Download Manual", value: res }])
    } catch (err) {
        client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Lagu Tersebut\n\n` + err)
    }
}, {
    query: "Masukkan Url | Enter A Url",
    wait: "*WAIT! | Mohon Tunggu Sebentar...*",
    param: functions.needed('query/Url')
})

cmd.on(['mega', 'megadl', 'megadownloader'], ['download'], async (msg, {
    client, query, urls
}) => {
    if (!urls) return client.reply(msg, `Masukkan Link Mega Yang ingin diunduh`)
    if (!urls && !urls[0].includes('mega.nz')) return client.reply(msg, `*Bruh, Masukkan Link Mega nya,*\n*_Bukan Link! : ${query}_*`)
    if (urls && !urls[0].includes('mega.nz')) return client.reply(msg, `*Bruh, Masukkan Link Mega nya,*\n*_Bukan Link! : ${query}_*`)
    try {
        let res = await mega.File.fromURL(urls[0])
        let data = await res.downloadBuffer()
        let result = await res.loadAttributes()
        return client.reply(msg, { document: data, fileName: result.name, caption: `*Mega Downloader*\n\n*Title:* ${result.name}\n*Size*: ${functions.parseByteName(result.size)}\n ${result.label} \n\n *MechaBot*` })
    } catch (err) {
        client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Lagu Tersebut\n\n` + err)
    }
}, {
    query: "Masukkan Url | Enter A Url",
    wait: "*WAIT! | Mohon Tunggu Sebentar...*",
    param: functions.needed('query/Url')
})

cmd.on(['searchapk', 'apksearch', 'apks'], ['download'], async (msg, {
    client, query, urls
}) => {
    try {
        let res = await searchApk(query)
        let captions = `*_${head}${line.repeat(4)}${list} Apk Search_*
*Aplikasi ditemukan*\n`
        for (let i = 0; i < res.length; i++) {
            const { name, thumb, url, dl_url, desc } = res[i]
            captions += `
*➛ Nama Aplikasi:* ${name}
*➛ Url:* ${url}
*➛ Url Download:* ${dl_url} 
*➛ Descriptions:* ${desc}
*_${head}${line.repeat(3)}${list}_*

`
        }
        client.reply(msg, { image: res[0].thumb, caption: captions + `*MechaBot*` })
    } catch (err) {
        client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Tersebut\n\n` + err)
    }
}, {
    query: "Masukkan Nama Aplikasi | Enter A Application Name",
    wait: "*WAIT! | Mohon Tunggu Sebentar...*",
    param: functions.needed('query/application name')
})

// cmd.on(['downloadapk', 'apkdl', 'dlapk', 'apkdownload'], ['download'], async (msg, {
//   client, query, prefix, command
// }) => {
//   if (!urls && !urls[0].includes('drive.google')) return client.reply(msg, `*Bruh, Masukkan Link Google Drive nya,*\n*_Bukan Link! : ${query}_*`)
//   if (urls && !urls[0].includes('drive.google')) return client.reply(msg, `*Bruh, Masukkan Link Google Drive nya,*\n*_Bukan Link! : ${query}_*`)
//   try {
//     let urel = query.replace("https://rexdlfile.com/", "https://rexdlbox.com/")
//     let res = await getApk(urel)
//     let caption = `*_${head}${line.repeat(4)}${list} Apk Downloader_*
// *Aplikasi telah Diunduh*`
//                 const { title, upload_at, views, download } = nim
//                 captions += `
//     *➛ Title:* ${title}
//     *➛ Diupload Pada:* ${upload_at}
//     *➛ Views:* ${views} 
//     *➛ Download:* 

//     `
//     for (let tr of nim.download) {
//         captions += functions.parseResult(tr, { body: "*➛ %key*: %value", footer: `${head}${line.repeat(3)}${list}`, headers: "\n" }) + "\n"
//       }

//     let caption = `*_${head}${line.repeat(4)}${list} Apk Downloader_*
// *Aplikasi telah Diunduh*

// ➛ Nama Aplikasi: ${res[0].name}
// ➛ Version: ${res[0].url}
// ➛ Size: ${res[0].desc}
// *_${head}${line.repeat(3)}${list}_*
// _Tunggu Sebentar MechaBot Sedang Menggirim File_

// *MechaBot*`

//     client.reply(msg, caption)
//     client.reply(msg, { document: res[0].dl_url.replace("https", "http"), mimetype: 'application/vnd.android.package-archivef', filename: res[0].name + ".apk" })
//   } catch (err) {
//     client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Tersebut\n\n` + err)
//   }
// }, {
//   query: "Masukkan Nama Aplikasi | Enter A Application Name",
//   wait: "*WAIT! | Mohon Tunggu Sebentar...*",
//   param: functions.needed('query/link')
// })



// cmd.on(['yt2'], ['download'], async (msg, { client, query }) => {
//   const filename = `${msg.sender.jid?.replace("@s.whatsapp.net", "")}-${msg.key.id}`;
//   const nem = [];
//   nem.push(filename)
//   console.log(`nem=` + nem)
//   await require("ytdl-core")(query).pipe(require('fs').createWriteStream(`./tmp/${nem}.mp4`))
//   client.reply(msg, { video: require('fs').readFileSync(`./tmp/${nem}.mp4`) })
//   if (nem.length > 0) { nem.push(""); console.log(`nem=` + nem) }
// }, {})

cmd.on(['pixiv'], ['download'], async (msg, { client, query }) => {
    try {
        let { data } = await Axios.get(`https://itztobz.me/api/piviv?query${query}`)
        result = data.result
        metadata = result[Math.floor(Math.random() * result.length)]
        let captions = `*${head}${line.repeat(4)}${list} Pixiv Downloader*
_*Gambar Ditemukan*_\n\n`
        captions += `
*ID:* ${metadata.id}
*Title:* ${metadata.title}
*Desc:* ${metadata.description}
*Tags:* ${metadata.tags}
*Created:* ${metadata.createDate}

*${head}${line.repeat(3)}${list}*
`
        let image = metadata.url
        client.reply(msg, { image: image, caption: captios })
    } catch (err) {
        client.reply(msg, `Terjadi Kesalahan Saat Mengambil Data Tersebut\n\n` + err)
    }
}, {})