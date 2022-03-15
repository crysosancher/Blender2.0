const Fs = require('fs')
const Axios = require('axios')
module.exports.downloadmeme = async (url) => {
    // const downloadmeme = async (url, path) => {
    const writer = Fs.createWriteStream("./pic.jpg")
    const response = await Axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })
    response.data.pipe(writer)
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    })
}