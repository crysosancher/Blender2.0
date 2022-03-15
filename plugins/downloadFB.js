const axios = require('axios');
const fs = require('fs');
const path = require('path');
module.exports.downloadFB = async (url) => {
    const writer = fs.createWriteStream("./fb.mp4");
    const response = await axios({
        url: url,
        method: 'GET',
        responseType: 'stream'
    })
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('end', resolve)
        writer.on('error', reject)
    })
}