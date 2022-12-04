const crud = require('../crud')
const EventEmitter = require('events');
const { jidDecode } = require("@adiwajshing/baileys")
const emitter = new EventEmitter()

function randomID(length) {
    let result = []
    const element = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ012345678/!@#$%^&*?';
    for (let index = 0; index < length; index++) {
        result.push(element[Math.floor(Math.random() * element.length)])
    }
    return result.join('') + '=='
}

function decodeJid(jid) {
    if (!jid) return jid
    if (/:\d+@/gi.test(jid)) {
        let decode = jidDecode(jid) || {}
        return decode.user && decode.server && decode.user + '@' + decode.server || jid
    } else return jid
}


function addUser({
    name,
    jid
}) {
    return new Promise((resolve, reject) => {
        crud.showUsers()
            .then((data) => {
                const index = data.result.findIndex(i => i.jid == jid)
                if (index == -1) {
                    crud.insertUser({
                            jid,
                            name
                        })
                        .then((result) => {
                            resolve({ status: true, user: 'new', result })
                        })
                        .catch(reject)
                } else {
                    crud.updateUser({
                        jid,
                        name
                    })
                    .then((result) => {
                        resolve({ status: true, user: 'old', result })
                    })
                    .catch(reject)
                }
            })
            .catch(reject)
    })
}

function toQueue({
    name,
    jid
}) {
    return new Promise((resolve, reject) => {
        addUser({
            name,
            jid
        }).then((added) => {
            crud.showChatting()
                .then((data) => {
                    const index = data.result.findIndex(i => i.jid == jid)
                    if (index == -1) {
                        crud.insertChatting({
                                jid,
                                chat_key: '',
                                status: 'SEARCHING'
                            })
                            .then(() => {
                                resolve(added)
                            })
                            .catch(reject)
                            
                    } else {
                        if (data.result[index].status == 'SEARCHING') {
                            reject({ status: false, code: 'stillsearch', message: 'Kamu masih search, stop atau tunggu' })
                            return
                        }
                        if (!data.result[index].chat_key) {
                            resolve({
                                status: true,
                                code: 'waiting',
                                message: 'Sedang mencari partner..',
                                user: added.user
                            })
                        } else {
                            reject({
                                status: false,
                                code: 'isChat',
                                message: 'Kamu mempunyai teman chat'
                            })
                        }
                    }
                })
                .catch(reject)
        }).catch(reject)
    })
}


function matchQueue(jid) {
    return new Promise((resolve, reject) => {
        const ranid = randomID(10) // Generate random id
        crud.showChatting() // Menampilkan semua yang sedang sesi chat dan tidak
            .then(async(dat) => {
                let result = dat.result 
                const index = result.findIndex(i => i.jid == jid)
                if (index != -1) { // cek jika user ada didalam sesi chatting/search
                    let queuedUsers = result.filter(i => (i.chat_key == '') && (i.jid != jid))
                    count = 0
                    while (queuedUsers.length < 1) { // jika gaada partner cari terus
                        result = (await crud.showChatting()).result
                        queuedUsers = result.filter(i => (i.chat_key == '') && (i.jid != jid)) // Cek jumlah antrian
                        let statement = result[result.findIndex(i => i.jid == jid)].status == 'STOP'
                        if (statement) {
                            crud.deleteChatting(jid)
                            .then(() => {
                                resolve({ status: true, code: 'stop', partner: jid })
                            }).catch(reject)
                            break
                        }
                    }
                    let statement = result[result.findIndex(i => i.jid == jid)].status == 'STOP'
                    if (statement) return
                    let partner = queuedUsers[0] // ketemu partner, ambil dari antrian paling pertama

                    let initClient = [ partner.jid.replace(/@.+/g,''), jid.replace(/@.+/g,'') ].sort() // Urut berdasarkan nomor, siapa yang menjadi kunci pemain
                    
                    let user1 = initClient[0] + '@s.whatsapp.net' // Set user pertama
                    let user2 = initClient[1] + '@s.whatsapp.net' // Set user kedua
                    // console.log(ranid);
                    crud.updateChatting({ jid: user1, chat_key: ranid, status: 'CHATTING' }).then().catch(console.log) // Set kunci chat user
                    crud.updateChatting({ jid: user2, chat_key: ranid, status: 'CHATTING' }).then().catch(console.log) // Set kunci chat partner user

                    resolve({ status: true, partner: partner.jid })
                } else {
                    reject({ status: false, message: 'Tidak ada nomermu di database! Gunakan "toQueue()"' })
                }
            })
            .catch(reject)
    })
}

function stopChatting(jid, skip = false) {
    return new Promise((resolve, reject) => {
        crud.showChatting()
        .then(({ result }) => {
            const index = result.findIndex(i => i.jid == jid)
            // console.log({ index, skip });
            if (index != -1) { // Cek jika ada atau tidak di database
                if (result[index].status == 'SEARCHING' && skip) {
                    reject({ status: false, code: 'cannotskip', message: 'Tidak bisa skip saat mulai, stop atau tunggu' })
                } else if (result[index].status == 'SEARCHING' && !skip) {
                    crud.updateChatting({ jid, chat_key: '', status: 'STOP' })
                    .then(() => {
                        resolve({ status: true, message: 'Berhasil stop sesi chat!', code: 'stopself', partner: jid })
                    })
                    .catch(e => reject({ status: false, e }))
                } else if (result[index].status == 'STOP') {
                    crud.deleteChatting(jid).then(() => { // Hapus kolom chat partner
                        resolve({ status: true, message: 'Berhasil stop sesi chat!', partner: jid })
                    })
                } else {
                    const partnerJID = result.filter(i => (i.jid != jid) && (i.chat_key == result[index].chat_key))[0]
                    crud.deleteChatting(jid).then(() => { // Hapus kolom chat user
                        crud.deleteChatting(partnerJID.jid).then(() => { // Hapus kolom chat partner
                            resolve({ status: true, message: 'Berhasil stop sesi chat!', partner: partnerJID })
                        })
                    })
                    .catch(e => reject({ status: false, e }))
                }
            } else {
                reject({ status: false, code: 'notstart', message: 'Kamu belum pernah mulai chat!' })
            }
        })
        .catch(reject)
    })
}


function skipChatting(jid) {
    return new Promise((resolve, reject) => {
        crud.showChatting()
        .then(({ result }) => {
            const index = result.findIndex(i => i.jid == jid)
            if (index != -1) { // Cek jika ada atau tidak di database
                if (result[index].chat_key == '') {
                    reject({ status: false, code: 'notchat', message: 'Kamu belum mulai chat!' })
                } else {
                    const partnerJID = result.filter(i => (i.jid != jid) && (i.chat_key == result[index].chat_key))[0]
                    crud.updateChatting({ jid, chat_key: '' }).then(() => { // Hapus kunci chat user
                        crud.deleteChatting(partnerJID.jid).then(() => { // Hapus kolom partner
                            matchQueue(jid).then(resolve).catch(reject)
                        })
                    })
                    .catch(e => reject({ status: false, e }))
                }
            } else {
                reject({ status: false, code: 'notstart', message: 'Kamu belum pernah mulai chat!' })
            }
        })
        .catch(reject)
    })
}
// console.log(matchQueue('no3'));
// stopChatting('6285559038021@s.whatsapp.net')
// .then(console.log)
// .catch(console.log)
// console.log(randomID(20));
module.exports = { matchQueue, toQueue, addUser, randomID, stopChatting, skipChatting }