const { Constant, db } = require('../database/mysql/connect')

function showChatting() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${Constant.table.chatting} ORDER BY chat_key ASC`, (e, data) => {
            if (e) return reject({ status: false, message: e })
            resolve({ status: true, result: data })
        })
    })
}

function insertChatting({ jid, chat_key, status }) {
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO ${Constant.table.chatting}(status, chat_key, jid) VALUES('${status}','${chat_key}', '${jid}')`, (e, data) => {
            if (e) return reject({ status: false, message: e })
            resolve({ status: true, result: data })
        })
    })
}

function updateChatting({ jid, chat_key, status }) {
    return new Promise((resolve, reject) => {
        db.query(`UPDATE ${Constant.table.chatting} SET status='${status}',chat_key='${chat_key}' WHERE jid='${jid}'`, (e, data) => {
            if (e) return reject({ status: false, message: e })
            resolve({ status: true, result: data })
        })
    })
}


function deleteChatting(jid) {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM ${Constant.table.chatting} WHERE jid='${jid}'`, (e, data) => {
            if (e) return reject({ status: false, message: e })
            resolve({ status: true, result: data })
        })
    })
}


function showUsers() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${Constant.table.users}`, (e, data) => {
            if (e) return reject({ status: false, message: e })
            resolve({ status: true, result: data })
        })
    })
}

function insertUser({ jid, name }) {
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO ${Constant.table.users}(nama, jid) VALUES("${encodeURIComponent(name)}", "${jid}")`, (e, data) => {
            if (e) return reject({ status: false, message: e })
            resolve({ status: true, result: data })
        })
    })
}

function updateUser({ jid, name }) {
    return new Promise((resolve, reject) => {
        db.query(`UPDATE ${Constant.table.users} SET nama="${encodeURIComponent(name)}" WHERE jid="${jid}"`, (e, data) => {
            if (e) return reject({ status: false, message: e })
            resolve({ status: true, result: data })
        })
    })
}


function deleteUser(jid) {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM ${Constant.table.users} WHERE jid='${jid}'`, (e, data) => {
            if (e) return reject({ status: false, message: e })
            resolve({ status: true, result: data })
        })
    })
}



function showBroadcast() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${Constant.table.broadcast}`, (e, data) => {
            if (e) return reject({ status: false, message: e })
            resolve({ status: true, result: data })
        })
    })
}

function insertBroadcast({ status, users, media, message }) {
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO ${Constant.table.broadcast}(status, users, media, message) VALUES("${status}","${users}", "${media}","${encodeURIComponent(message)}")`, (e, data) => {
            if (e) return reject({ status: false, message: e })
            resolve({ status: true, result: data })
        })
    })
}

function updateBroadcast({ status, users, media, message }) {
    return new Promise((resolve, reject) => {
        db.query(`UPDATE ${Constant.table.broadcast} SET status="${status}",users="${users}",media="${media}",message="${message}"`, (e, data) => {
            if (e) return reject({ status: false, message: e })
            resolve({ status: true, result: data })
        })
    })
}


function deleteBroadcast() {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM ${Constant.table.broadcast}`, (e, data) => {
            if (e) return reject({ status: false, message: e })
            resolve({ status: true, result: data })
        })
    })
}


module.exports = {
    deleteChatting, deleteUser,
    showChatting, showUsers,
    updateChatting, updateUser,
    insertChatting, insertUser,
    showBroadcast, insertBroadcast,
    updateBroadcast, deleteBroadcast,
}