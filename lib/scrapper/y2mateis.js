const axios  = require('axios');
const fakeua = require('fake-useragent');
const scraper = axios.create({
    headers: {
        accept: 'application/json, text/javascript, /; q=0.01',
        dnt: '1',
        'sec-fetch-mode': 'cors',
        'User-Agent': fakeua(),
        origin: 'https://en.y2mate.is',
        'sec-ch-ua-platform': '"Linux"',
    },
    timeout: 20000,
});
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

Array.prototype.lastIndex = function () {
    return this[this.length - 1];
};

async function ytdl(url, type) {
    type = type == 'mp4' ? 'video' : 'audio';
    try {
        let analyze = await scraper.get(`https://y2mate.is/analyze?url=${url}`);
        if (analyze.status >= 200) {
            const resp = await scraper.get(
                `https://srv20.y2mate.is/listFormats?url=${url}`
            );
            const { data: listFormats } = resp;
            if (listFormats.error) throw listFormats;
            let data = listFormats.formats[type];
            if (!data) throw new Error('some error occur');
            let lastFormat = data.lastIndex();
            let { url: convertURL, needConvert } = lastFormat;
            if (needConvert) {
                const { data: convertData } = await scraper.get(convertURL);
                if (convertData.error) throw convertData;
                const { url: getLink } = convertData;
                let result = {};
                while (true) {
                    const { data: res } = await scraper.get(getLink);
                    if (res.status === 'ready') {
                        delete lastFormat.url;
                        let buffer = await scraper.get(res.url, {
                            responseType: 'arraybuffer',
                        });
                        result = {
                            ...res,
                            ...lastFormat,
                            buffer: Buffer.from(buffer.data, 'binary'),
                        };
                        break;
                    }
                    await sleep(100);
                }
                return result;
            } else {
                return { ...data.lastIndex() };
            }
        } else throw 'error';
    } catch (err) {
        throw err;
    }
}

// if (require.main == module) {
//   (async () => {
//     let url = 'https://www.youtube.com/watch?v=IA_Pufhe-Wk';
//     console.log(await yt(url, 'mp3'));
//   })();
// }
module.exports = { ytdl }