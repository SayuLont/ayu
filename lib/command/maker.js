process.on("uncaughtException", console.log);
let wombos = require('../scrapper/wombo.js')
const fs = require('fs');
const Command = require("../command");
const { TelegraPh } = require("../scrapper/imgupload")
const { default: axios } = require("axios");

// sticker
cmd.on(['sticker', 'stiker', 's', 'sgif', 'stickergif', 'stikergif'], ['maker'], async (msg, { client }) => {
  let down = msg.isMedia ? msg.downloadMsg : msg.quotedMsg.downloadMsg
  let apakahvideo = msg.message.videoMessage
  let cekdetik = apakahvideo && apakahvideo.seconds > 11
  let apakahvideotag = msg.quotedMsg && msg.quotedMsg.message.videoMessage
  let cekdetiktag = apakahvideotag && apakahvideotag.seconds > 11
  if (apakahvideo && cekdetik || apakahvideotag && cekdetiktag) return client.reply(msg, 'Maksimal 10 detik!')
  let buff = await down()
  client.reply(msg, { sticker: buff, exif: functions.createExif('Create By: Mechabot', "Owner: Squeezed") })
}, {
  _media: true,
  param: functions.needed('tag media'),
  sensitive: true
})

cmd.on(['stickerwm', 'stikerwatermark', 'swm', 'sgifwm', 'stickergifwm', 'stikergifwatermark'], ['maker'], async (msg, { client, query }) => {
  let anu = query.split("|")[0]
  let ini = query.split("|")[1]
  let down = msg.isMedia ? msg.downloadMsg : msg.quotedMsg.downloadMsg
  let apakahvideo = msg.message.videoMessage
  let cekdetik = apakahvideo && apakahvideo.seconds > 11
  let apakahvideotag = msg.quotedMsg && msg.quotedMsg.message.videoMessage
  let cekdetiktag = apakahvideotag && apakahvideotag.seconds > 11
  if (apakahvideo && cekdetik || apakahvideotag && cekdetiktag) return client.reply(msg, 'Maksimal 10 detik!')
  let buff = await down()
  client.reply(msg, { sticker: buff, exif: functions.createExif(`${anu}`, `${ini}`) })
}, {
  _media: true,
  param: functions.needed('tag media'),
  sensitive: true,
  query: "Masukan watermark 1 | watermark 2",
  param: functions.needed('1 | 2')
})

cmd.on(['smeme', 'stickmeme', 'stikmeme', 'stickermeme', 'stikermeme'], ['maker'], async (msg, { client, query }) => {
  let down = msg.isMedia ? msg.downloadMsg : msg.quotedMsg.downloadMsg
  down = await down()
  let ran = await client.getRandom('.png')
  let filename = './trash/' + Date.now() + ".png"
  functions.fs.writeFileSync(filename, down.buffer)
  let { exec } = require('child_process')
  exec(`ffmpeg -i ${filename} ${ran}`, async (err) => {
    functions.fs.unlinkSync(filename)
    // let buffer = functions.fs.readFileSync(ran)
    let anu = await TelegraPh(ran)
    let atas = query.split('|')[0] ? query.split('|')[0] : '-'
    let bawah = query.split('|')[1] ? query.split('|')[1] : '-'
    let smeme = `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.png?background=${anu}`
    client.reply(msg, { sticker: smeme, exif: functions.createExif('Create By: Mechabot', "Owner: Squeezed") })
    functions.fs.unlinkSync(ran)
  })
  // let anu = await TelegraPh(filename)
  // let atas = query.split('|')[0] ? query.split('|')[0] : '-'
  // let bawah = query.split('|')[1] ? query.split('|')[1] : '-'
  // let smeme = `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.png?background=${anu}`
  // await client.reply(msg, { sticker: smeme, exif: functions.createExif('Create By: Mechabot', "Owner: Squeezed") })

  // let down = await msg.isMedia ? msg.downloadMsg:msg.quotedMsg.downloadMsg
  // down = await down()
  // let ran = await client.getRandom('.png')
  // let filename = './trash/'+Date.now()+".png"
  // functions.fs.writeFileSync(filename,down.buffer)
  // let {exec} = require('child_process')
  // exec(`ffmpeg -i ${filename} ${ran}`, (err) => {
  //   functions.fs.unlinkSync(filename)
  //   let buffer = functions.fs.readFileSync(ran)
  //  client.reply(msg, {image: buffer, caption:`Berhasil`})
  //   functions.fs.unlinkSync(ran)
  // })
}, {
  _media: true,
  wait: "*WAIT! | Mohon Tunggu Sebentar..*",
  query: "Masukkan Sebuah Kalimat | Example : #smeme Hai | Hallo ",
  param: functions.needed('tag media')
})

// TOIMG
cmd.on(['toimg', 'img', 'toimage'], ['convert'], async (msg, { client, query }) => {
  let down = await msg.isMedia ? msg.downloadMsg : msg.quotedMsg.downloadMsg
  down = await down()
  let ran = await client.getRandom('.png')
  let filename = './trash/' + Date.now() + ".png"
  functions.fs.writeFileSync(filename, down.buffer)
  let { exec } = require('child_process')
  exec(`ffmpeg -i ${filename} ${ran}`, (err) => {
    functions.fs.unlinkSync(filename)
    let buffer = functions.fs.readFileSync(ran)
    client.reply(msg, { image: buffer, caption: `Berhasil` })
    functions.fs.unlinkSync(ran)
  })
}, {
  _media: true,
  wait: "*WAIT! | Mohon Tunggu Sebentar..*",
  param: functions.needed('Tag Sticker')
})

cmd.on(['emojimix', 'emojimix2'], ['maker'], async (msg, { client, query, command, text }) => {
  if (command == "emojimix") {
    try {
      let an = await axios(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(`${query.split("+")[0].replace(" ", "")}`)}_${encodeURIComponent(`${query.split("+")[1].replace(" ", "")}`)}`)
      return client.reply(msg, { sticker: an.data.results[0].url, exif: functions.createExif('Create By: Mechabot', "Owner: Squeezed", "Mecha-Bot") })
    } catch (e) {
      client.reply(msg, "tidak ada kombinasi untuk emoji ini silahkan cobalagi dengan emoji lain")
    }
  }
  if (command == "emojimix2") {
    try {
      let an = await axios(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(query)}`)
      return client.reply(msg, { sticker: an.data.results[0].url, exif: functions.createExif('Create By: Mechabot', "Owner: Squeezed", "Mecha-Bot") })
    } catch (e) {
      client.reply(msg, "Tidak ada hasil")
    }
  }
}, {
  query: "Masukkan emoji + emoji |Example: !emojimix 😁+😭",
  param: functions.needed('query')
})
// WOMBO BY:NAJMYW WEHHEHE
// WOMBO
cmd.on(['wombo', 'womboart', 'dreamart', 'dream', 'ai-art', 'wombodream'], ['maker'], async (msg, {
  client, query, prefix
}) => {
  let data = await wombos.womboss()
  if (data[0].styles[0].name.endsWith('undefined')) return await client.reply(msg, 'ERROR! | Terjadi Kesalahan Saat Mengambil Data Tersebut!')
  let has = data[0].styles.map(i => {
    return { title: i.name, value: `#wombosend ${i.id}♡${query}`, description: i.id, head: "Wombo Dream Art" }
  })
  await client.sendButton(msg, { text: "\b\b\bPlease Select the Name Art you want to download! \n Silakan Pilih Nama Art yang ingin Anda unduh!", buttonText: "Klik Here" }, has)
}, {
  query: "Masukkan Sebuah Pencarian Terserah | Enter A Type Anything",
  param: functions.needed('query')
})
// WOMBO
cmd.on(['sampah', 'wombosend'], [], async (msg, {
  client, query, prefix
}) => {
  setTimeout(() => {
    client.reply(msg, 'Generating...')
  }, 1500);
  let data = await wombos.wombo(query.split('♡')[1], query.split('♡')[0])
  await client.reply(msg, { image: data, caption: `➛ *Wombo Dream Art :* ${query.split('♡')[1].toUpperCase()}` })
  if (data) return await client.reply(msg, '*Success Mengirimkan Hasil!*')
}, {
  query: "Silahkan Gunakan Fitur : #wombo",
  param: functions.needed('query')
})

//IMAGE MANIPULATION
cmd.on(['brokecard'], [], async (msg, { client, query }) => {
  let down = await msg.isMedia ? msg.downloadMsg : msg.quotedMsg.downloadMsg
  down = await down()
  let ran = await client.getRandom('.jpg')
  let filename = './trash/' + Date.now() + ".jpg"
  functions.fs.writeFileSync(filename, down.buffer)
  brokeCard(filename)
    .then((rest) => {
      client.reply(msg, { image: rest.result, caption: `Succes` });
      functions.fs.unlinkSync(ran);
    })
    .catch((e) => {
      client.reply(msg, `Mohon maaf, terdapat kesalahan!`)
      functions.fs.unlinkSync(ran);
      console.log(e);
    });
}, {
  _media: true,
  wait: "*WAIT! | Mohon Tunggu Sebentar..*",
  param: functions.needed('tag media')
})
