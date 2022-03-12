const axios = require('axios');
const AnimeUrl = 'https://animechan.vercel.app/api/';
let mes = '';
module.exports.getAnimeRandom = async (name) => {
    const response = await axios.get(`${AnimeUrl}` + name);
    if (name == 'random') {
        mes = 'Anime : ' + response.data.anime + '\nCharacter : ' + response.data.character + '\nQuote : ' + response.data.quote;
    }
    else {
        let i = (response.data.length == 1) ? 0 : Math.floor(Math.random() * 11);
        mes = 'Anime : ' + response.data[i].anime + '\nCharacter : ' + response.data[i].character + '\nQuote : ' + response.data[i].quote;
    }
    return new Promise((resolve, reject) => {
        if (mes != '') {
            resolve(mes)
        } else {
            reject('Anime or Character not found!! Enter right Spelling or different Anime or Character.')
        }
    })
}
