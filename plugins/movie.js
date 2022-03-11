const axios = require("axios");
const downloadholly = async (movie) => {
    const baseurl = "https://pronoob-movies.tk/wER?search=";
    let link = baseurl + movie.toUpperCase().split(" ").join("+");
    console.log(link);
    const res = await axios({
        method: "GET",
        url: link,
        responseType: "streamarraybuffer",
    });
    data = res.data;
    let word = data.trim().replace(/^\s+|\s+$/gm, '').split("\n");
    for (let i = 0; i < word.length; i++) {
        if (word[i].startsWith("<a href")) {
            if (word[i].endsWith('mkv"') || word[i].endsWith('mp4"')) {
                let url += " https://pronoob-movies.tk/" + word[i].substr(9, word[i].length - 10) + "\n\n";
                // console.log(url);

            }
        }
    }
    return new Promise((resolve, reject) => {
        if (url == '')
            reject('No Movie found. Try Write correct name or diffrent moive.');
        else
            resolve(url);
    })
}
const downloadbolly = async (movie) => {
    const baseurl = "https://pronoob-movies.tk/UyX?search=";
    let link = baseurl + movie.toUpperCase().split(" ").join("+");
    console.log(link);
    const res = await axios({
        method: "GET",
        url: link,
        responseType: "streamarraybuffer",
    });
    data = res.data;
    let word = data.trim().replace(/^\s+|\s+$/gm, '').split("\n");
    for (let i = 0; i < word.length; i++) {
        if (word[i].startsWith("<a href")) {
            if (word[i].endsWith('mkv"') || word[i].endsWith('mp4"')) {
                let url += " https://pronoob-movies.tk/" + word[i].substr(9, word[i].length - 10) + "\n\n";
                // console.log(url);

            }
        }
    }
    return new Promise((resolve, reject) => {
        if (url == '')
            reject(downloadholly(movie));
        else
            resolve(url);
    })
}
module.exports.downloadAll = async (movie) => {
    const baseurl = "https://pronoob-aio.cf/Sct?search=";
    let link = baseurl + movie.toUpperCase().split(" ").join("+");
    console.log(link);
    const res = await axios({
        method: "GET",
        url: link,
        responseType: "streamarraybuffer",
    });
    data = res.data;
    let word = data.trim().replace(/^\s+|\s+$/gm, '').split("\n");
    for (let i = 0; i < word.length; i++) {
        if (word[i].startsWith("<a href")) {
            if (word[i].endsWith('mkv"') || (word[i].endsWith('mp4"'))) {
                let url += " https://pronoob-aio.cf/" + word[i].substr(9, word[i].length - 10) + "\n\n";
                // console.log(url);
            }
        }
    }
    return new Promise((resolve, reject) => {
        if (url == '')
            reject(downloadbolly(movie));
        else
            resolve(url);
    })
}
