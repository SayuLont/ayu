let cheerio = require('cheerio')
let axios = require("axios")

async function zippyDl(url) {
    return new Promise(async(resolve, reject) => {
	let [hostname, _, id] = url.split`/`
    await axios.get(url).then(({data}) => {
	if (data.includes('File does not exist on this server')) throw 'File not exists'
	let $ = cheerio.load(data)
	let fileName = $('title').text().replace('Zippyshare.com - ', '')
    let fileSize = $('div.center').find('font').eq(4).text()
	let fileUpload = $('div.center').find('font').eq(6).text()
	let res = data.match(new RegExp(`(?<=dlbutton)(.*)(?=;)`, 'gm'))[0].replace("').href = ", '')
    resolve({ status: true, result: {name: fileName, size: fileSize, upload: fileUpload, download: `${hostname}//${id}${eval(res)}`}, creator: "Squeezed Orange- Prassz" }).catch((e) => reject({ status: false, message: e.message }))    
}).catch(reject)
    })  
}

module.exports.zippyDl = zippyDl

// return zippyDl("https://www54.zippyshare.com/v/2fkyAK7j/file.html")