const fs = require('fs')
//0-2684
function tebak(path) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(path)) return reject({ status: false, message: 'TG DB File not found' })
        const db = JSON.parse(fs.readFileSync(path))
        resolve(db[Math.floor(Math.random() * db.length)])
    })
}

module.exports.tebak = tebak;