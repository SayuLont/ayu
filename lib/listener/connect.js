var alreadyConnected = false;
database.saveOn = 1;
process.on("uncaughtException", console.error);

client.ev.on('connection.update', async(update) => {
  if (update.connection == 'open') {
    alreadyConnected = true;
  } else if (update.connection == 'close') {
    return process.send(global.shutoff ? 'close': 'reset');
  }
});
global.counter = 20
global.lastargs = []
client.ev.on ('creds.update', async(...args) => {
  if (counter >= 20) {
    await session.saveCreds(...args);
    counter = 0;
  }
  counter++;
  lastargs = args
});