try {
  new (require('./lib/functions.js'))().run();
  process.on('uncaugtException', console.log)
} catch (e) {
  console.log({
    Error: e, path: __dirname
  })
}