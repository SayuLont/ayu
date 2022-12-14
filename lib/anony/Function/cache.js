const fs = require('fs')

/**
 * Uncache if there is file change
 * @param {string} module Module name or path
 * @param {function} cb <optional> 
 */
 function nocache(module, cb = () => { }) {
    console.log(`Watching ${module}`)
    fs.watchFile(require.resolve(module), async () => {
         await uncache(require.resolve(module))
         cb(module)
    })
}

/**
* Uncache a module
* @param {string} module Module name or path
*/
function uncache(module = '.') {
    return new Promise((resolve, reject) => {
         try {
              delete require.cache[require.resolve(module)]
              resolve()
         } catch (e) {
              reject(e)
         }
    })
}

module.exports = { nocache, uncache }