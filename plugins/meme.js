const axios = require('axios');
const fs = require('fs');
module.exports.getMeme = async (url) => {
    const response = await axios({
        method: 'GET',
        url: url.image,
        responseType: 'stream'
    })
    let name = url.caption;
    response.data.pipe(fs.createWriteStream("./meme.jpg"))
    return new Promise((resolve, reject) => {
        response.data.on('end', () => {
            resolve()
        })
        response.data.on('error', () => {
            reject()
        })
    })
}