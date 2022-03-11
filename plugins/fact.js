const axios = require("axios");
const factURL = "https://nekos.life/api/v2/fact";
module.exports.getFact = async () => {
    let { data } = await axios.get(factURL);
    return new Promise((resolve, reject) => {
        resolve(data.fact);
        reject('Error')
    })
}
