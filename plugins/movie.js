const axios = require("axios");
module.exports.downloadholly = async (movie) => {
    const baseurl = "https://pronoob-movies.tk/wER?search=";
    let link = baseurl + movie.toUpperCase().split(" ").join("+");
    let url = '';
    console.log(link);
    const res = await axios({
        method: "GET",
        url: link,
        responseType: "streamarraybuffer",
    });
    data = res.data;
    let word = data.trim().replace(/^\s+|\s+$/gm, '').split("\n");
    try {
        for (let i = 0; i < word.length; i++) {
            if (word[i].startsWith("<a href")) {
                if (word[i].endsWith('mkv"') || word[i].endsWith('mp4"')) {
                    url += " https://pronoob-movies.tk/" + word[i].substr(9, word[i].length - 10) + "\n\n";
                    // console.log(url);

                }
            }
        }
    }
    catch (error) {
        console.log("Error");
    }
    return new Promise((resolve, reject) => {
        if (url == '')
            reject('');
        else
            resolve(url);
    })

}
module.exports.downloadbolly = async (movie) => {
    const baseurl = "https://pronoob-movies.tk/UyX?search=";
    let link = baseurl + movie.toUpperCase().split(" ").join("+");
    let url = '';
    console.log(link);
    const res = await axios({
        method: "GET",
        url: link,
        responseType: "streamarraybuffer",
    });
    data = res.data;
    let word = data.trim().replace(/^\s+|\s+$/gm, '').split("\n");
    try {
        for (let i = 0; i < word.length; i++) {
            if (word[i].startsWith("<a href")) {
                if (word[i].endsWith('mkv"') || word[i].endsWith('mp4"')) {
                    url += " https://pronoob-movies.tk/" + word[i].substr(9, word[i].length - 10) + "\n\n";
                    // console.log(url);
                }
            }
        }
    }
    catch (error) {
        console.log("Error");
    }
    return new Promise((resolve, reject) => {
        if (url == '')
            reject('');
        else
            resolve(url);
    })
}
module.exports.downloadAll = async (movie) => {
    const baseurl = "https://pronoob-aio.cf/Sct?search=";
    let link = baseurl + movie.toUpperCase().split(" ").join("+");
    console.log(link);
    let url = '';
    const res = await axios({
        method: "GET",
        url: link,
        responseType: "streamarraybuffer",
    });
    data = res.data;
    let word = data.trim().replace(/^\s+|\s+$/gm, '').split("\n");
    try {
        for (let i = 0; i < word.length; i++) {
            if (word[i].startsWith("<a href")) {
                if (word[i].endsWith('mkv"') || (word[i].endsWith('mp4"'))) {
                    url += " https://pronoob-aio.cf/" + word[i].substr(9, word[i].length - 10) + "\n\n";
                    // console.log(url);
                }
            }
        }
    }
    catch (error) {
        console.log("error");
    }
    return new Promise((resolve, reject) => {
        if (url == '')
            reject('');
        else
            resolve(url);
    })
}
