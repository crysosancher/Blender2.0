/* ---------------------------------- SONG ---------------------------------- */
const downloadSong = async (randomName, query) => {
    try {
        const INFO_URL = "https://slider.kz/vk_auth.php?q=";
        const DOWNLOAD_URL = "https://slider.kz/download/";
        let { data } = await axios.get(INFO_URL + query);

        if (data["audios"][""].length <= 1) {
            console.log("==[ SONG NOT FOUND! ]==");
            return "NOT";
        }

        //avoid remix,revisited,mix
        let i = 0;
        let track = data["audios"][""][i];
        while (/remix|revisited|mix/i.test(track.tit_art)) {
            i += 1;
            track = data["audios"][""][i];
        }
        //if reach the end then select the first song
        if (!track) {
            track = data["audios"][""][0];
        }

        let link = DOWNLOAD_URL + track.id + "/";
        link = link + track.duration + "/";
        link = link + track.url + "/";
        link = link + track.tit_art + ".mp3" + "?extra=";
        link = link + track.extra;
        link = encodeURI(link); //to replace unescaped characters from link

        let songName = track.tit_art;
        songName =
            songName =
            songName =
            songName.replace(/\?|<|>|\*|"|:|\||\/|\\/g, ""); //removing special characters which are not allowed in file name
        // console.log(link);
        // download(songName, link);
        const res = await axios({
            method: "GET",
            url: link,
            responseType: "stream",
        });
        data = res.data;
        const path = `./${randomName}`;
        const writer = fs.createWriteStream(path);
        data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on("finish", () => resolve(songName));
            writer.on("error", () => reject);
        });
    } catch (err) {
        console.log(err);
        return "ERROR";
    }
};

const getInstaVideo = async (url) => {
    // const getInstaVideo = async (url) => {
    let imgDirectLink = "",
        videoDirectLink = "";
    try {
        if (url.includes("?")) url = url.slice(0, url.search("\\?"));
        const res = await axios.get(url + "?__a=1", {
            headers: {
                accept:
                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
                "cache-control": "max-age=0",
                "sec-ch-ua":
                    '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
                "sec-ch-ua-mobile": "?1",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "none",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                cookie:
                    'csrftoken=EGyRH8qhrSMhkgGdS9nNDWHPpoCcaHbo; ds_user_id=10649290531; fbm_124024574287414=base_domain=.instagram.com; fbsr_124024574287414=700KXq9enAC8XKupuaPKn9ZKtzfWa02XbcPPRwexA44.eyJ1c2VyX2lkIjoiMTAwMDIyNjAzNTc4ODQxIiwiY29kZSI6IkFRRFIxSzVCeDFRbWZ0SERyZy1IaGJJUE55Wl9zcWYtVXVoWUFTazVGdFhqbE9wWUVaQTRmc2ZsTHB6WWFZeXZ4TEt0dXFHeE1Bc1pBUGlrUURvSk1ka3FkRFNoeUtnMEJyOU1NcEZYdnAwS1JoQWFkT3J0OHlWSlNEUHdFQkUyallHSEtaRmx3NURCWGlnSXNDeFdHZnBiQUFHcGduTDhVb0Z4NDZ1UnJNUVhIRER6N08wOUNXSlYtNWRmV3R0cnpNUlRtX2QweFdBS0JnYVJLVmJwZFNZbHoyOTFpb3RURGZSS2czQ3dKcEVHR3RndUZERnc2NmxEdlJ0TDNSRFhXS0U0MVlNQmZYQTdoQXF4YXAwaXBRZEg4MG83TDduMVVFRmpmMXVsVHNXY05ncmluZ2hPZWd0c3I2eEYxWXI3TExEaDJGdnNRZGF3T0g4UWRmV200bkdSTHJPbnZPVXBxcjFETGhMb3JiNXEwUSIsIm9hdXRoX3Rva2VuIjoiRUFBQnd6TGl4bmpZQkFPbGhaQTZQNkxUZEd2NXZaQkRWdExBelpCeVlXSUt2ZkdNWkF1R3VLR1pDS25kcWRKNGVoWkFiWkJmTUM4TDJaQW9WMU1BWDk4eW5OVDZaQVNRU3hpYldDVzUyMmt3dDJoTmNveGVaQlBuZGhVTmczVkljclc4T2RoT3NraGRqMXBYWkF0M1BHcFg4TkNiWXJjVWNrZlZIOFpBWE56dVpCZzJnU3ZaQmhaQlJNcWpOOElJT2FpQnZ6M0xNbFVaRCIsImFsZ29yaXRobSI6IkhNQUMtU0hBMjU2IiwiaXNzdWVkX2F0IjoxNjQyNjk2OTQxfQ; ig_did=1E00B61D-FD13-49D9-896B-A50916A8825D; ig_nrcb=1; mid=YbIw2wALAAH3bFovqxkUBvzCmEIL; rur=LDC\\05410649290531\\0541674232763:01f7b0c1a0d0e0b701878c29d3af807bd5cffc0ec7d30a16be6a4a99eeddabb47ebdf67a; sessionid=10649290531%3AW6GGexZiS8WH8x%3A2; shbid=7195\\05410649290531\\0541674232590:01f7587fffcb9795186ef1b30f060089aaec7c465603942081e01b8ff34e7bd9ea98d703; shbts=1642696590\\05410649290531\\0541674232590:01f7339d6d150f009a010003fe38277b4868f5c24c3ed5c6885076d13d604199f4171970; fbsr_124024574287414=wexp8m3OE7FIRFo2kf4pHDByja62coq0YZeaNcNFsWo.eyJ1c2VyX2lkIjoiMTAwMDIyNjAzNTc4ODQxIiwiY29kZSI6IkFRQ2hnRE9NVC1naGpoSXg4MTRjSjdSQW9xMjdGQkJJdktXbXZiTlFFcGVjUnJsdWRJVUxrWnFCaXY4MmJyRzU1RGdSVUhXdmhJMDZIY1VTX1dubkg5aDNHZmExeUZ4UWxPeS0wTGNOcUNNTlBNTGo2VDBHZUlsNDVqU0FzRXpLZDFlV0JvUTJzSzVselpYSmtEa2dGMW1LYnRLNHJGQkJYcmx6dU9oYUZrUlZZYVBfbnpyRFpTUDhzODBRRFJ0RE4xYUJyVEllR3ZYczdjWHlTTFVBN1F4eGo5UVF3NHNWbkhqQTV3eTJQbEVfbTZuU3NkQlVZNUZSUUwxa0g2UFdNU0wyU1pfYmtSMFhkbWZzYWtCc3o3WjBPWmdzTV9KaEx4VFJGUGRGVUhrM3BBYlJtNGFqY1pkVEpMZTB2eGRETlN0bVBrM0NQSy1ZeV9ITFdyVjRhMldDaHNpd3FHUWNRQzlHdWFsbE53emN6ZyIsIm9hdXRoX3Rva2VuIjoiRUFBQnd6TGl4bmpZQkFFQVpCTFlJbm9nSkt0WDVoOHpiQnBLNGRCdUpDY2dQQTFhOGZaQVpBaWZLckNYaG1CYlJRUWE1MnJrUGdSUzM0eHJ5NGRzbEZHbHNjMVV4Szd3Y3hiNjA0OG44WkF5em9wNHNmQzgwVEJ3N3dFVjdRSVNmWHRtZEFHMlBLRW82bkZoNll4RHNOY2tVRmtoNWcycGlyVW5WMGJaQjZGYjhmODg0Nmg0QmRJWkFzWkJZY1J0dlpCY1pEIiwiYWxnb3JpdGhtIjoiSE1BQy1TSEEyNTYiLCJpc3N1ZWRfYXQiOjE2NDI2OTY1NTl9',
            },
            referrerPolicy: "strict-origin-when-cross-origin",
            body: null,
            method: "GET",
            mode: "cors",
        });
        // console.log(res.data);

        if (res.status == 200 && res.data.graphql.shortcode_media.is_video) {
            videoDirectLink = res.data.graphql.shortcode_media.video_url;
        }
        imgDirectLink = res.data.graphql.shortcode_media.display_url;
    } catch (err) {
        console.log(err);
    }
    // console.log({ imgDirectLink, videoDirectLink });
    return { imgDirectLink, videoDirectLink };
};


/* ------------------------------------ INSTA -----------------------------------  */
const saveInstaVideo = async (randomName, videoDirectLink) => {
    const response = await axios({
        url: videoDirectLink,
        method: "GET",
        responseType: "stream",
        headers: {
            accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
            "cache-control": "max-age=0",
            "sec-ch-ua":
                '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
            "sec-ch-ua-mobile": "?1",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
        },
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors",
    });

    const path = `./${randomName}`;
    const writer = fs.createWriteStream(path);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
    });
};





// WEB SERVER
const express = require('express')
const server = express()
const axios = require('axios');
const ud = require('urban-dictionary')
const inshorts = require('inshorts-api');
const fs = require('fs');
const ytdl = require('ytdl-core');
const yahooStockPrices = require('yahoo-stock-prices');
const port = process.env.PORT || 8000;
server.get('/', (req, res) => { res.send('V-Bot server running...') })
server.listen(port, () => {
    console.clear()
    console.log('\nWeb-server running!\n')
})

// LOAD Baileys
const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange,
    MessageOptions,
    WALocationMessage,
    WA_MESSAGE_STUB_TYPES,
    ReconnectMode,
    ProxyAgent,
    waChatKey,
    mentionedJid,
    processTime,
} = require('@adiwajshing/baileys')

// LOAD DB CONNECTION
const db = require('./database');

// LOAD ADDITIONAL NPM PACKAGES
//const fs = require('fs')//file module
const ffmpeg = require('fluent-ffmpeg')//sticker module
const WSF = require('wa-sticker-formatter')//sticker module

async function fetchauth() {
    try {
        auth_result = await db.query('select * from auth;');//checking auth table
        console.log('Fetching login data...')
        auth_row_count = await auth_result.rowCount;
        if (auth_row_count == 0) {
            console.log('No login data found!')
        } else {
            console.log('Login data found!')
            auth_obj = {
                clientID: auth_result.rows[0].clientid,
                serverToken: auth_result.rows[0].servertoken,
                clientToken: auth_result.rows[0].clienttoken,
                encKey: auth_result.rows[0].enckey,
                macKey: auth_result.rows[0].mackey
            }
        }
    } catch {
        console.log('Creating database...')//if login fail create a db
        await db.query('CREATE TABLE auth(clientID text, serverToken text, clientToken text, encKey text, macKey text);');
        await fetchauth();
    }

}

// BASIC SETTINGS
prefix = '/';
source_link = '```https://github.com/crysosancher/Blender2.0```';

// LOAD CUSTOM FUNCTIONS
const getGroupAdmins = (participants) => {
    admins = []
    for (let i of participants) {
        i.isAdmin ? admins.push(i.jid) : ''
    }
    return admins
}
const adminHelp = (prefix, groupName) => {
    return `
  ─「 *${groupName} Admin Commands* 」─
  *${prefix}blend*
   _For GUI interface_
  *${prefix}list*
   _For Automated Commands_
  *${prefix}song*
   _For Downloading songs by name_
       Eg:${prefix}song tum hi ho
  *${prefix}add <phone number>*
      _Add any new member!_
  *${prefix}ban <@mention>*
      _Kick any member out from group!_
      _Alias with ${prefix}remove, ${prefix}kick_
    
  *${prefix}delete*
      _delete message send by bot_
      _Alias ${prefix}d, ${prefix}delete_
  *${prefix}promote <@mention>*
      _Give admin permission to a member!_
  *${prefix}demote <@mention>*
      _Remove admin permission of a member!_
  *${prefix}rename <new-subject>*
      _Change group subject!_
  *${prefix}chat <on/off>*
      _Enable/disable group chat_
      _${prefix}chat on - for everyone!_
      _${prefix}chat off - for admin only!_
  *${prefix}link*
      _Get group invite link!_
      _Alias with ${prefix}getlink, ${prefix}grouplink_
  *${prefix}sticker*
      _Create a sticker from different media types!_
      *Properties of sticker:*
          _crop_ - Used to crop the sticker size!
          _author_ - Add metadata in sticker!
          _pack_ - Add metadata in sticker!
          _nometadata_ - Remove all metadata from sticker!
      *Examples:*
          _${prefix}sticker pack Blender author bot_
          _${prefix}sticker crop_
          _${prefix}sticker nometadata_
  *${prefix}news*
      _Show Tech News_
      _or ${prefix}news <any category>_
      _Use ${prefix}list for whole valid list_
      _category could be sports,business or anything_
  *${prefix}score*
       _fetch live ipl scores_
       eg:${prefix}score
  *${prefix}idp*
       _download Instagram private profile picture_
       eg:${prefix}idp username
  *${prefix}insta*
      _download Instagram media_
      eg:${prefix}insta linkadress     
       
  *${prefix}yt*
      _download youTube video in best quality_
      eg:${prefix}yt linkadress
  *${prefix}yts*
      _download youtube audio_
      eg:/yts linkadress
      
  *${prefix}price*
      _show crypto price_
      eg:vprice btc
  *${prefix}stocks*
      _show stocks price_
      eg:${prefix}stocks zomato.bo
      for _BSI_ use *bo* as suffix
      for _NSI_ use *ns* as suffix
  *${prefix}mmi*
    _show MMi status_
    with advice      
      
  *${prefix}horo*
      _show horoscope_
      eg:${prefix}horo pisces    
  *${prefix}tagall*
      _For attendance alert_(Testing phase)
  *${prefix}tts*
      _Changes Text to Sticker_
      eg:- ${prefix}tts we Love Dev
          
  *${prefix}ud*
      _Show Meaning of your name_
      eg:${prefix}ud ram
  *${prefix}dic*
      _A classic Dictionary_
      eg:${prefix}ud ram   
  *${prefix}removebot*
      _Remove bot from group!_
      
      
  *${prefix}source*
      _Get the source code!_
  Made with love,use with love ♥️`
}


let allowedNumbs = ["917070224546", "918318585418", "916353553554"];//enter your own no. for having all the super user previlage


const getRandom = (ext) => { return `${Math.floor(Math.random() * 10000)}${ext}` }

// TECH NEWS ---------------------------

const url = "https://news-pvx.herokuapp.com/";
let latestNews = "TECH NEWS--------";

const getNews = async () => {
    const { data } = await axios.get(url);
    console.log(typeof data);
    let count = 0;

    let news = "☆☆☆☆☆💥 Tech News 💥☆☆☆☆☆ \n\n";
    data["inshorts"].forEach((headline) => {
        count += 1
        if (count > 13) return;
        news = news + "🌐 " + headline + "\n\n";
    });
    return news;
};

const postNews = async (categry) => {
    console.log(categry)
    let n = '';
    let z = categry;
    let arr = ['national', 'business', 'sports', 'world', 'politics', 'technology', 'startup', 'entertainment', 'miscellaneous', 'hatke', 'science', 'automobile'];
    if (!arr.includes(z)) {
        return "Enter a valid category:) or use -category for more info:)";
    }
    var options = {
        lang: 'en',
        category: z,
        numOfResults: 13
    }
    n = `☆☆☆☆☆💥 ${z.toUpperCase()} News 💥☆☆☆☆☆ \n\n`
    await inshorts.get(options, function (result) {
        for (let i = 0; i < result.length; i++) {
            temp = "🌐 " + result[i].title + "\n";
            n = n + temp + "\n";
        }
    }).catch((er) => "");

    return n;
}
//mmi pic
const scrapeProduct = async (url) => {
    console.log("Aa gaya hoon toh kya")
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(url);
    const [el] = await page.$x('//*[@id="main"]/section/div/div[3]/div[1]/div/a/img')
    const src = await el.getProperty('src');
    const srcTxt = await src.jsonValue();
    browser.close();
    return srcTxt;

}
const fi = async () => {
    var confiq = {
        method: 'GET',
        url: 'https://api.alternative.me/fng/?limit=1'
    }
    console.log("Puppi")
    let puppi;
    await axios.request(confiq).then((res) => {
        puppi = res.data.data[0].value
    }).catch((err) => {
        return false;
    })
    return puppi;

}
async function getPrice() {
    var mainconfig = {
        method: 'get',
        url: 'https://public.coindcx.com/market_data/current_prices'
    }
    return axios(mainconfig)
}
module.exports = {
    getPrice
}
//song name
const fsun = async (sname) => {
    const yts = require('yt-search')
    const r = await yts(`${sname}`)

    const videos = r.videos.slice(0, 3)
    let st = videos[0].url;
    return st;
}
//insatdp
const instadp = async (url3) => {
    const dp = await axios.get(url3, {
        headers: {
            accept:
                'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
            'cache-control': 'max-age=0',
            'sec-ch-ua':
                '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
            'sec-ch-ua-mobile': '?1',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'none',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            cookie:
                'mid=YSEC4AALAAF5bk0tas41HCJDdxtP; ig_did=B2AB4361-90CF-41D5-B36E-03E66EEE1AA1; ig_nrcb=1; fbm_124024574287414=base_domain=.instagram.com; csrftoken=rhAkB2pduDbm5MTbyIofl0UrbR7Jr3AE; ds_user_id=4274094922; sessionid=4274094922%3Ay2mh0rvpQWd74X%3A19; shbid="17689\\0544274094922\\0541661437335:01f71a0599f6f1fdd84afc93ceb82193825b09ee67cdb74f25a8f1b14b2d3acd3cc89283"; shbts="1629901335\\0544274094922\\0541661437335:01f7ad7ac6485740dfe51c33ba803579ce09dad43e3b5dbc1f73c8bc8b41a5f734a9c458"; fbsr_124024574287414=veflxUzvfnSZgJ06Av5OS7EeCnhBb8Qs9bS57QEcvYY.eyJ1c2VyX2lkIjoiMTAwMDAzMDkxMzYxODk1IiwiY29kZSI6IkFRQzlPTzlES0ZDUk5pZ0QwQUZFa1ljeE14ME15MnVtdE5UeXVLdk95R1VibUdMVVdaWm95c1k3cDA5eXNsSmlBbjUtQkh3WWZnNGlwU0lnOWNPUzNVeVdwMU9sa0tLRU51SjBic3hldTRBNFphcDU3QzFkLXdxVVJveXlTREs2eWlYWFg3WXhuaTdseGRvdTEySFgyUFhjbV83Ul9QR2IzU2RMbTMyRUdZYjBNQ1JXSGxMVElfTWdMT0pBT3BpYTV0c3E5ZXBZc19mbG5fSU9PRnZURjhoWlF4MEVpT2c3YU9tb01uZF91b0Q5SHhzX0lreG85dHRuSjc4dWp6NzJsN3I1UEdHMXFWV25pQnVnTVJNczY1c0wtSTVvVmRkM0dZM1Q2MWoySi1VRVdlTy1OSENuVmtqTmNsdDNQUkowZGtSQkd2cGhZdUZ2NVBpWnZoLXRqdUVlIiwib2F1dGhfdG9rZW4iOiJFQUFCd3pMaXhuallCQUUxNnhEMkh5bHFaQU9sQ0xvbWI2b3NnS0I2dVlNVER4NVl3YlVJb0FZQ2t5ZjdPclZjZ2tpVFVGd1J0SVgxWkFhY1h4Z3dYQ3Z3aEJ6NjhmTWJmRGNrVVBqaUFoaWpxTVpCZzg5QUxpYjYzbXZMZlB5TWRrQkg4NU1BVkt0RXhnb1V2Q0hzd3g0S3V4WE9PTmUzcWZDVmJaQWViSGY5endhWkJyNVd6UCIsImFsZ29yaXRobSI6IkhNQUMtU0hBMjU2IiwiaXNzdWVkX2F0IjoxNjI5OTI1ODA3fQ; rur="LLA\\0544274094922\\0541661461817:01f7d8ba9ccfea9b57dbe7964bccfad9730064d4820485744c887fce9e53db3b4bf43c9f"',
        },
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: null,
        method: 'GET',
        mode: 'cors',
    })
    //console.log(dp.data.graphql.user.profile_pic_url_hd)
    return dp.data.graphql.user.profile_pic_url_hd
}
//Hroroscope function
async function gethoro(sunsign) {
    var mainconfig = {
        method: 'POST',
        url: `https://aztro.sameerkumar.website/?sign=${sunsign}&day=today`
    }
    let horo
    await axios.request(mainconfig).then((res) => {
        horo = res.data

    }).catch((error) => {
        return false;
    })
    return horo;

}
//classic Dictionary
async function dictionary(word) {
    var config = {
        method: 'GET',
        url: `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    }
    let classic;
    await axios.request(config).then((res) => {
        classic = res.data[0];

    }).catch((error) => {
        return;
    })
    return classic;
}

const cric = async (Mid) => {
    var confiq = {
        method: 'GET',
        url: `https://cricket-api.vercel.app/cri.php?url=https://www.cricbuzz.com/live-cricket-scores/${Mid}/33rd-match-indian-premier-league-2021`
    }
    let ms;
    await axios.request(confiq).then((res) => {
        ms = res.data.livescore;
    }).catch((err) => {
        return;
    })
    return ms;
}
const daaa = async (sto) => {
    var s = '';
    await yahooStockPrices.getCurrentData(`${sto}`).then((res) => {
        console.log(res);
        s = `*STOCK* :- _${sto}_
  *Currency* :- _${res.currency}_                   
  *Price*:- _${res.price}_`;
    }).catch((err) => {
        s = 'Not Found';
    });
    return s;
};




// MAIN FUNCTION
async function main() {

    // LOADING SESSION
    const conn = new WAConnection()
    conn.logger.level = 'warn'
    conn.on('qr', () => { console.log('SCAN THE ABOVE QR CODE TO LOGIN!') })
    await fetchauth(); //GET LOGIN DATA
    if (auth_row_count == 1) { conn.loadAuthInfo(auth_obj) }
    conn.on('connecting', () => { console.log('Connecting...') })
    conn.on('open', () => {
        console.clear()
        console.log('Connected!')
    });
    conn.connectOptions.alwaysUseTakeover = true;
    //conn.setMaxListeners(50);
    await conn.connect({ timeoutMs: 30 * 1000 })
    const authInfo = conn.base64EncodedAuthInfo() // UPDATED LOGIN DATA
    load_clientID = authInfo.clientID;
    load_serverToken = authInfo.serverToken;
    load_clientToken = authInfo.clientToken;
    load_encKey = authInfo.encKey;
    load_macKey = authInfo.macKey;
    // INSERT / UPDATE LOGIN DATA
    if (auth_row_count == 0) {
        console.log('Inserting login data...')
        db.query('INSERT INTO auth VALUES($1,$2,$3,$4,$5);', [load_clientID, load_serverToken, load_clientToken, load_encKey, load_macKey])
        db.query('commit;')
        console.log('New login data inserted!')
    } else {
        console.log('Updating login data....')
        db.query('UPDATE auth SET clientid = $1, servertoken = $2, clienttoken = $3, enckey = $4, mackey = $5;', [load_clientID, load_serverToken, load_clientToken, load_encKey, load_macKey])
        db.query('commit;')
        console.log('Login data updated!')
    }

    conn.on('group-participants-update', (anu) => {
        try {
            const mdata = conn.groupMetadata(anu.jid)
            console.log(anu)
            if (anu.action == 'add') {
                num = anu.participants[0]
                num_split = `${num.split('@s.whatsapp.net')[0]}`
                console.log('Joined: ', num)
            }
        } catch (e) {
            console.log(e)
        }
    })

    conn.on('chat-update', async (mek) => {
        try {
            if (!mek.hasNewMessage) return
            mek = JSON.parse(JSON.stringify(mek)).messages[0]
            if (!mek.message) return
            if (mek.key && mek.key.remoteJid == 'status@broadcast') return
            if (mek.key.fromMe) return
            const content = JSON.stringify(mek.message)
            global.prefix
            const from = mek.key.remoteJid
            const type = Object.keys(mek.message)[0]
            const {
                text,
                extendedText,
                contact,
                location,
                liveLocation,
                image,
                video,
                sticker,
                document,
                audio,
                product,
                listMessage,
                buttonsMessage,
                buttonsResponseMessage,
                listResponseMessage,

            } = MessageType

            body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') && mek.message.buttonsResponseMessage.selectedDisplayText.startsWith(prefix) ? mek.message.buttonsResponseMessage.selectedDisplayText : (type == 'listResponseMessage') && mek.message.listResponseMessage.title.startsWith(prefix) ? mek.message.listResponseMessage.title : ''
            const birthday = new Date();
            let hou = birthday.getHours();
            let minu = birthday.getMinutes();
            let sex = birthday.getSeconds()
            if (hou == 19 && minu == 21) {
                console.log("Chal raha")
                body = '/news'
            }
            const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
            const args = body.trim().split(/ +/).slice(1)
            const ev = body.trim().split(/ +/).slice(1).join('')
            const isCmd = body.startsWith(prefix)

            errors = {
                admin_error: '_❌ ERROR: Bot need Admin privilege❌_'//_
            }

            const botNumber = conn.user.jid
            const isGroup = from.endsWith('@g.us')
            const sender = isGroup ? mek.participant : mek.key.remoteJid
            const groupMetadata = isGroup ? await conn.groupMetadata(from) : ''
            const groupName = isGroup ? groupMetadata.subject : ''
            const groupMembers = isGroup ? groupMetadata.participants : ''
            const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
            const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
            const isGroupAdmins = groupAdmins.includes(sender) || false

            const reply = (teks) => {
                conn.sendMessage(from, teks, text, {
                    quoted: mek
                })
            }
            const costum = async (pesan, tipe, target, target2) => {
                await conn.sendMessage(from, pesan, tipe, {
                    quoted: {
                        key: {
                            fromMe: false,
                            participant: `${target}`,
                            ...(from ? {
                                remoteJid: from
                            } : {})
                        },
                        message: {
                            conversation: `${target2}`
                        }
                    }
                })
            }



            const isMedia = (type === 'imageMessage' || type === 'videoMessage')
            const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
            const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
            const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
            let senderNumb = sender.split('@')[0];
            //console.log("SENDER NUMB:", senderNumb);

            if (isCmd) {
                console.log('[COMMAND]', command, '[FROM]', sender.split('@')[0], '[IN]', groupName, 'type=', typeof (args), hou, minu, sex)

                /////////////// COMMANDS \\\\\\\\\\\\\\\
                switch (command) {

                    /////////////// HELP \\\\\\\\\\\\\\\

                    case 'help':
                    case 'acmd':
                        if (!isGroup) return;
                        await costum(adminHelp(prefix, groupName), text);

                        break

                    case 'link':
                    case 'getlink':
                    case 'grouplink':
                        if (!isGroup) return;
                        if (!isBotGroupAdmins) return reply(errors.admin_error);
                        gc_invite_code = await conn.groupInviteCode(from)
                        gc_link = `https://chat.whatsapp.com/${gc_invite_code}`
                        conn.sendMessage(from, gc_link, text, {
                            quoted: mek,
                            detectLinks: true
                        })
                        break;

                    case 'tts':
                        if (!isGroup) return;
                        var take = args[0];
                        for (i = 1; i < args.length; i++) {
                            take += " " + args[i];

                        }
                        console.log(take, "=tts message");
                        await axios.get('https://api.xteam.xyz/attp?file&text=' + take, { responseType: 'arraybuffer' }).then(async (res) => {
                            await conn.sendMessage(from, Buffer.from(res.data), MessageType.sticker, { mimetype: Mimetype.webp })
                        }).catch((err) => {
                            reply("Icons are not supported")
                        })



                        break;
                    case 'tagall':
                        if (!isGroup) return;
                        console.log("SENDER NUMB:", senderNumb);

                        if (allowedNumbs.includes(senderNumb) || isGroupAdmins) {
                            let jids = [];
                            let mesaj = '';
                            var id;

                            for (let i of groupMembers) {
                                mesaj += '⟪ @' + i.id.split('@')[0] + ' ⟫ \n';
                                jids.push(i.id.replace('c.us', 's.whatsapp.net'));
                            }
                            let tx = "xyz"
                            await conn.sendMessage(from, mesaj, MessageType.extendedText,
                                { contextInfo: { mentionedJid: jids }, quoted: mek });
                        }
                        else {
                            reply("No Permission!,Contact Developer!")
                        }
                        break;


                    case 'sticker':
                        if (!isGroup) return;

                        // Format should be <prefix>sticker pack <pack_name> author <author_name>
                        var packName = ""
                        var authorName = ""

                        // Check if pack keyword is found in args!
                        if (args.includes('pack') == true) {
                            packNameDataCollection = false;
                            for (let i = 0; i < args.length; i++) {
                                // Enables data collection when keyword found in index!
                                if (args[i].includes('pack') == true) {
                                    packNameDataCollection = true;
                                }
                                if (args[i].includes('author') == true) {
                                    packNameDataCollection = false;
                                }
                                // If data collection is enabled and args length is more then one it will start appending!
                                if (packNameDataCollection == true) {
                                    packName = packName + args[i] + ' '
                                }
                            }
                            // Check if variable contain unnecessary startup word!
                            if (packName.startsWith('pack ')) {
                                packName = `${packName.split('pack ')[1]}`
                            }
                        }


                        // Check if author keyword is found in args!
                        if (args.includes('author') == true) {
                            authorNameDataCollection = false;
                            for (let i = 0; i < args.length; i++) {
                                // Enables data collection when keyword found in index!
                                if (args[i].includes('author') == true) {
                                    authorNameDataCollection = true;
                                }
                                // If data collection is enabled and args length is more then one it will start appending!
                                if (authorNameDataCollection == true) {
                                    authorName = authorName + args[i] + ' '
                                }
                                // Check if variable contain unnecessary startup word!
                                if (authorName.startsWith('author ')) {
                                    authorName = `${authorName.split('author ')[1]}`
                                }
                            }
                        }

                        // Check if packName and authorName is empty it will pass default values!
                        if (packName == "") {
                            packName = "Blender"
                        }
                        if (authorName == "") {
                            authorName = "2.0"
                        }

                        outputOptions = [`-vcodec`, `libwebp`, `-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`];
                        if (args.includes('crop') == true) {
                            outputOptions = [
                                `-vcodec`,
                                `libwebp`,
                                `-vf`,
                                `crop=w='min(min(iw\,ih)\,500)':h='min(min(iw\,ih)\,500)',scale=500:500,setsar=1,fps=15`,
                                `-loop`,
                                `0`,
                                `-ss`,
                                `00:00:00.0`,
                                `-t`,
                                `00:00:10.0`,
                                `-preset`,
                                `default`,
                                `-an`,
                                `-vsync`,
                                `0`,
                                `-s`,
                                `512:512`
                            ];
                        }

                        if ((isMedia && !mek.message.videoMessage || isQuotedImage)) {
                            const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
                            const media = await conn.downloadAndSaveMediaMessage(encmedia)
                            ran = getRandom('.webp')
                            reply('⌛Changing media to sticker⏳')//⌛Ruk Bhai..Kar raha ⏳
                            await ffmpeg(`./${media}`)
                                .input(media)
                                .on('error', function (err) {
                                    fs.unlinkSync(media)
                                    console.log(`Error : ${err}`)
                                    reply('_❌ ERROR: Failed to convert image into sticker! ❌_')
                                })
                                .on('end', function () {
                                    buildSticker()
                                })
                                .addOutputOptions(outputOptions)
                                .toFormat('webp')
                                .save(ran)

                            async function buildSticker() {
                                if (args.includes('nometadata') == true) {
                                    conn.sendMessage(from, fs.readFileSync(ran), sticker, { quoted: mek })
                                    fs.unlinkSync(media)
                                    fs.unlinkSync(ran)
                                } else {
                                    const webpWithMetadata = await WSF.setMetadata(packName, authorName, ran)
                                    conn.sendMessage(from, webpWithMetadata, MessageType.sticker)
                                    fs.unlinkSync(media)
                                    fs.unlinkSync(ran)
                                }
                            }

                        } else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11)) {
                            const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
                            const media = await conn.downloadAndSaveMediaMessage(encmedia)
                            ran = getRandom('.webp')
                            reply('⌛Changing media file to Sticker⏳')//⌛ Ho raha Thoda wait karle... ⏳
                            await ffmpeg(`./${media}`)
                                .inputFormat(media.split('.')[1])
                                .on('error', function (err) {
                                    fs.unlinkSync(media)
                                    mediaType = media.endsWith('.mp4') ? 'video' : 'gif'
                                    reply(`_❌ ERROR: Failed to convert ${mediaType} to sticker! ❌_`)
                                })
                                .on('end', function () {
                                    buildSticker()
                                })
                                .addOutputOptions(outputOptions)
                                .toFormat('webp')
                                .save(ran)

                            async function buildSticker() {
                                if (args.includes('nometadata') == true) {
                                    conn.sendMessage(from, fs.readFileSync(ran), sticker, { quoted: mek })
                                    fs.unlinkSync(media)
                                    fs.unlinkSync(ran)
                                } else {
                                    const webpWithMetadata = await WSF.setMetadata(packName, authorName, ran)
                                    conn.sendMessage(from, webpWithMetadata, MessageType.sticker)
                                    fs.unlinkSync(media)
                                    fs.unlinkSync(ran)
                                }
                            }
                        }
                        break

                    case 'ud':
                        if (!isGroup) return;
                        try {

                            let result = await ud.define(args[0])

                            let term = result[0].word;
                            let def = result[0].definition;
                            let example = result[0].example;

                            reply(`*Term*: ${term} 
  *Definition*: ${def}
  *Example*: ${example}`);
                        }
                        catch {
                            reply("🙇‍♂️ Sorry to say but this word/creature does not exist")
                        }

                        break
                    case 'idp':
                        let prof = args[0];


                        axios.get(`https://www.instagram.com/${prof}/?__a=1`, {
                            headers: {
                                accept:
                                    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9',
                                'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
                                'cache-control': 'max-age=0',
                                'sec-ch-ua':
                                    '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
                                'sec-ch-ua-mobile': '?1',
                                'sec-fetch-dest': 'document',
                                'sec-fetch-mode': 'navigate',
                                'sec-fetch-site': 'none',
                                'sec-fetch-user': '?1',
                                'upgrade-insecure-requests': '1',
                                cookie:
                                    'mid=YSEC4AALAAF5bk0tas41HCJDdxtP; ig_did=B2AB4361-90CF-41D5-B36E-03E66EEE1AA1; ig_nrcb=1; fbm_124024574287414=base_domain=.instagram.com; csrftoken=rhAkB2pduDbm5MTbyIofl0UrbR7Jr3AE; ds_user_id=4274094922; sessionid=4274094922%3Ay2mh0rvpQWd74X%3A19; shbid="17689\\0544274094922\\0541661437335:01f71a0599f6f1fdd84afc93ceb82193825b09ee67cdb74f25a8f1b14b2d3acd3cc89283"; shbts="1629901335\\0544274094922\\0541661437335:01f7ad7ac6485740dfe51c33ba803579ce09dad43e3b5dbc1f73c8bc8b41a5f734a9c458"; fbsr_124024574287414=veflxUzvfnSZgJ06Av5OS7EeCnhBb8Qs9bS57QEcvYY.eyJ1c2VyX2lkIjoiMTAwMDAzMDkxMzYxODk1IiwiY29kZSI6IkFRQzlPTzlES0ZDUk5pZ0QwQUZFa1ljeE14ME15MnVtdE5UeXVLdk95R1VibUdMVVdaWm95c1k3cDA5eXNsSmlBbjUtQkh3WWZnNGlwU0lnOWNPUzNVeVdwMU9sa0tLRU51SjBic3hldTRBNFphcDU3QzFkLXdxVVJveXlTREs2eWlYWFg3WXhuaTdseGRvdTEySFgyUFhjbV83Ul9QR2IzU2RMbTMyRUdZYjBNQ1JXSGxMVElfTWdMT0pBT3BpYTV0c3E5ZXBZc19mbG5fSU9PRnZURjhoWlF4MEVpT2c3YU9tb01uZF91b0Q5SHhzX0lreG85dHRuSjc4dWp6NzJsN3I1UEdHMXFWV25pQnVnTVJNczY1c0wtSTVvVmRkM0dZM1Q2MWoySi1VRVdlTy1OSENuVmtqTmNsdDNQUkowZGtSQkd2cGhZdUZ2NVBpWnZoLXRqdUVlIiwib2F1dGhfdG9rZW4iOiJFQUFCd3pMaXhuallCQUUxNnhEMkh5bHFaQU9sQ0xvbWI2b3NnS0I2dVlNVER4NVl3YlVJb0FZQ2t5ZjdPclZjZ2tpVFVGd1J0SVgxWkFhY1h4Z3dYQ3Z3aEJ6NjhmTWJmRGNrVVBqaUFoaWpxTVpCZzg5QUxpYjYzbXZMZlB5TWRrQkg4NU1BVkt0RXhnb1V2Q0hzd3g0S3V4WE9PTmUzcWZDVmJaQWViSGY5endhWkJyNVd6UCIsImFsZ29yaXRobSI6IkhNQUMtU0hBMjU2IiwiaXNzdWVkX2F0IjoxNjI5OTI1ODA3fQ; rur="LLA\\0544274094922\\0541661461817:01f7d8ba9ccfea9b57dbe7964bccfad9730064d4820485744c887fce9e53db3b4bf43c9f"',
                            },
                            referrerPolicy: 'strict-origin-when-cross-origin',
                            body: null,
                            method: 'GET',
                            mode: 'cors',
                        }).then((res) => {
                            console.log(res.data.graphql.user.profile_pic_url_hd);
                            const downurl = (res.data.graphql.user.profile_pic_url_hd);
                            downImage(downurl);

                        }).catch((err) => {
                            reply("Bad Luck....");
                        })
                        const downImage = async (url) => {
                            const ran = getRandom('.jpg');
                            const writer = fs.createWriteStream(ran)
                            const response = await axios({
                                url,
                                method: 'GET',
                                responseType: 'stream'
                            })

                            response.data.pipe(writer)
                            return new Promise((resolve, reject) => {
                                writer.on('finish', resolve)
                                writer.on('error', reject)
                            }).then(async (res) => {
                                await conn.sendMessage(
                                    from,
                                    fs.readFileSync(ran), // send directly from remote url!
                                    MessageType.image,
                                    { mimetype: Mimetype.jpg, caption: `${prof}   ~Blender👽`, quoted: mek }
                                )
                                fs.unlinkSync(ran);
                            }).catch(err => {
                                reply(`Unexpected Downfall,can Retry after 5 sec..`);
                            });
                        }

                        break

                    case 'dice':
                        if (!isGroup) return;
                        let upper = 6
                        let lower = 1
                        let myRandom = Math.floor(Math.random() * (upper - lower + 1) + lower)
                        reply(`Hey,Your luck gives you:\n🎲${myRandom}🎲`)
                        break

                    case 'horo':
                        if (!isGroup) return;
                        console.log("SENDER NUMB:", senderNumb);
                        let horoscope = args[0];
                        let h_Low = horoscope.toLowerCase();
                        let l = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces']
                        if (!l.includes(h_Low)) {
                            reply("Kindly enter the right spelling ")//SAhi se daal bhai,sign 12 he hote hai :)       
                        } else {
                            const callhoro = await gethoro(h_Low);
                            reply(` *Date Range*:-${callhoro.date_range}
 *Nature Hold's For you*:-${callhoro.description}
 *Compatibility*:-${callhoro.compatibility}
 *Mood*:-${callhoro.mood}
 *color*:-${callhoro.color}
 *Lucky Number*:-${callhoro.lucky_number}
 *Lucky time*:-${callhoro.lucky_time}                       `)
                        }
                        break

                    case 'dic':
                        if (!isGroup) return;
                        let w = args[0]
                        const dick = await dictionary(w)
                        console.log(dick.word)
                        //console.log(dick)
                        reply(`*Term*:- ${dick.word}
  *Pronounciation*:- ${dick.phonetic}
  *Meaning*: ${dick.meanings[0].definitions[0].definition}
  *Example*: ${dick.meanings[0].definitions[0].example}`)
                        break
                    case 'yt':
                        if (!isGroup) return;
                        var url = args[0];
                        console.log(`${url}`)
                        const dm = async (url) => {
                            let info = ytdl.getInfo(url)
                            let rany = getRandom('.mp4')
                            const stream = ytdl(url, { filter: info => info.itag == 22 || info.itag == 18 })
                                .pipe(fs.createWriteStream(rany));
                            console.log("Video downloaded")
                            await new Promise((resolve, reject) => {
                                stream.on('error', reject)
                                stream.on('finish', resolve)
                            }).then(async (res) => {
                                await conn.sendMessage(
                                    from,
                                    fs.readFileSync(rany),
                                    MessageType.video,
                                    { mimetype: Mimetype.mp4, caption: "Blender 👽", quoted: mek }
                                )
                                console.log("Sent ")
                                fs.unlinkSync(rany)

                            }).catch((err) => {
                                reply('Unable to download,contact dev.');
                            });

                        }
                        dm(url)
                        break
                    case 'category':
                        if (!isGroup) return;
                        reply(` *Use this options as category* :
  national (India)
  business
  sports
  world
  politics
  technology
  startup
  entertainment
  miscellaneous
  hatke (unusual)
  science
  automobile`)
                        break
                    case 'source':
                        reply(`${source_link}`)
                        break
                    case 'list':
                        if (!isGroup) return;
                        const row1 = [
                            { title: '/news national', description: "News About national category", rowId: "rowid1" },
                            { title: '/news sports', description: "News About sports category", rowId: "rowid2" },
                            { title: '/news world ', description: "News About world category", rowId: "rowid3" },
                            { title: '/news politics', description: "News About politics category", rowId: "rowid4" },
                            { title: '/news science', description: "News About science category", rowId: "rowid5" },
                            { title: '/news technology', description: "News About tech category", rowId: "rowid6" },
                            { title: '/news entertainment', description: "News About entertainment category", rowId: "rowid7" },
                            { title: '/news automobile', description: "News About automobile category", rowId: "rowid8" },
                        ]
                        const row2 = [
                            { title: '/horo aries', description: "Today's Horoscope ", rowId: "rowid1" },
                            { title: '/horo taurus', description: "Today's Horoscope", rowId: "rowid2" },
                            { title: '/horo gemini', description: "Today's Horoscope", rowId: "rowid3" },
                            { title: '/horo cancer', description: "Today's Horoscope", rowId: "rowid4" },
                            { title: '/horo leo', description: "Today's Horoscope", rowId: "rowid5" },
                            { title: '/horo virgo', description: "Today's Horoscope", rowId: "rowid6" },
                            { title: '/horo libra', description: "Today's Horoscope", rowId: "rowid7" },
                            { title: '/horo scorpio', description: "Today's Horoscope", rowId: "rowid8" },
                            { title: '/horo sagittarius', description: "Today's Horoscope", rowId: "rowid9" },
                            { title: '/horo capricorn', description: "Today's Horoscope", rowId: "rowid10" },
                            { title: '/horo aquarius', description: "Today's Horoscope", rowId: "rowid11" },
                            { title: '/horo pisces', description: "Today's Horoscope", rowId: "rowid12" },
                        ]


                        const sections = [{ title: "News Section", rows: row1 },
                        { title: "Horoscope Section ", rows: row2 }
                        ]

                        const button = {
                            buttonText: 'Blenders Magic ✨',
                            description: "Enter inside my World 👽",
                            sections: sections,
                            listType: 1
                        }
                        const sendMsg = await conn.sendMessage(from, button, MessageType.listMessage)
                        break

                    case 'blend':
                        if (!isGroup) return;
                        const buttons = [
                            { buttonId: 'id1', buttonText: { displayText: '/help' }, type: 1 },
                            { buttonId: 'id2', buttonText: { displayText: '/news' }, type: 1 },
                            { buttonId: 'id3', buttonText: { displayText: '/list' }, type: 1 },
                        ]

                        const buttonMessage = {
                            contentText: "Hi,Check out my Features",
                            footerText: 'version-2.0',
                            buttons: buttons,
                            headerType: 1
                        }

                        const sendBMsg = await conn.sendMessage(from, buttonMessage, MessageType.buttonsMessage)


                        break;

                    case 'yts':
                        if (!isGroup) return;
                        var url1 = args[0];
                        console.log(`${url1}`)
                        const am = async (url1) => {
                            let info = ytdl.getInfo(url1)
                            let sany = getRandom('.mp3')
                            const stream = ytdl(url1, { filter: info => info.audioBitrate == 160 || info.audioBitrate == 128 })
                                .pipe(fs.createWriteStream(sany));
                            console.log("audio downloaded")
                            await new Promise((resolve, reject) => {
                                stream.on('error', reject)
                                stream.on('finish', resolve)
                            }).then(async (res) => {
                                await conn.sendMessage(
                                    from,
                                    fs.readFileSync(sany),
                                    MessageType.audio,
                                    { mimetype: Mimetype.mp4Audio, caption: "Blender 👽", quoted: mek }
                                ).then((resolved) => {
                                    console.log("Sent ")
                                    fs.unlinkSync(sany)
                                })

                                    .catch((reject) => {
                                        reply`Enable to download send a valid req`
                                    })

                            }).catch((err) => {
                                reply`Unable to download,contact dev.`;
                            });

                        }
                        am(url1)
                        break


                    /* ------------------------------- CASE: INSTA ------------------------------ */
                    case "insta":
                    case "i":
                        if (!isGroup) {
                            reply("❌ Group command only!");
                            return;
                        }
                        if (args.length === 0) {
                            reply(`❌ URL is empty! \nSend ${prefix}insta url`);
                            return;
                        }
                        let urlInsta = args[0];

                        if (
                          !(
                            urlInsta.includes("instagram.com/p/") ||
                            urlInsta.includes("instagram.com/reel/") ||
                            urlInsta.includes("instagram.com/tv/")
                          )
                        ) {
                          reply(
                            `❌ Wrong URL! Only Instagram posted videos, tv and reels can be downloaded.`
                          );
                          //return;
                        }

                        try {
                            console.log("Video downloading ->", urlInsta);
                            // console.log("Trying saving", urlInsta);
                            let { imgDirectLink, videoDirectLink } = await getInstaVideo(
                                urlInsta
                            );
                            if (videoDirectLink) {
                                let randomName = getRandom(".mp4");
                                await saveInstaVideo(randomName, videoDirectLink);
                                let stats = fs.statSync(`./${randomName}`);
                                let fileSizeInBytes = stats.size;
                                // Convert the file size to megabytes (optional)
                                let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
                                console.log("Video downloaded ! Size: " + fileSizeInMegabytes);

                                //  { caption: "hello there!", mimetype: Mimetype.mp4 }
                                // quoted: mek for tagged
                                if (fileSizeInMegabytes <= 40) {
                                    await conn.sendMessage(
                                        from,
                                        fs.readFileSync(`./${randomName}`), // can send mp3, mp4, & ogg
                                        MessageType.video,
                                        {
                                            mimetype: Mimetype.mp4,
                                            quoted: mek,
                                        }
                                    );
                                } else {
                                    reply(`❌ File size bigger than 40mb.`);
                                }
                                fs.unlinkSync(`./${randomName}`);
                            } else if (imgDirectLink) {
                                await conn.sendMessage(
                                    from,
                                    { url: imgDirectLink },
                                    MessageType.image,
                                    { quoted: mek }
                                );
                            } else {
                                reply(`❌ There is some problem!`);
                            }
                        } catch (err) {
                            console.log(err);
                            reply(`❌ There is some problem.`);
                        }
                        break

                    //Eval Try to avoid this function 
                    case 'devil':
                        if (!allowedNumbs.includes(senderNumb)) {
                            reply("Sorry only for moderators")
                            return;
                        }
                        console.log(mek)
                        var k = args.join(' ');
                        console.log(k);
                        var store = await eval(k);
                        console.log(store);
                        var store2 = JSON.stringify(store);
                        reply(`${store2}`);


                        break;

                    case 'price':
                        if (!isGroup) return;
                        console.log("SENDER NUMB:", senderNumb);
                        var date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
                        getPrice().then((resolved) => {
                            var cc = args[0];
                            var cc1 = cc.toUpperCase() + "INR"
                            var cc2 = cc.toUpperCase() + "USDT";
                            var cc3 = cc.toUpperCase() + "BTC";
                            var kprice = resolved.data[cc2]
                            var iPrice = resolved.data[cc1]
                            var bPrice = resolved.data[cc3]
                            if (kprice) {
                                reply(`*${cc2}* = $${Number(kprice)}
  *${cc1}* = ₹${Number(iPrice)}
  *${cc3}* = ${Number(bPrice)}`);

                            } else {
                                reply('Coin not found');
                            }
                        }).catch((err) => {
                            console.log(err);
                        });

                        break
                    case 'stocks':
                    case 'stock': {
                        const s3 = await daaa(args[0].toUpperCase());
                        reply(`${s3}`)
                        break;
                    }
                    case 'mmi':
                        await conn.sendMessage(
                            from,
                            { url: `https://alternative.me/crypto/fear-and-greed-index.png` }, // send directly from remote url!
                            MessageType.image,
                            { mimetype: Mimetype.png, caption: "~Blender👽", quoted: mek }
                        )
                        await fi().then(async (res) => {
                            if (res == false) {
                                reply(`bad luck`);
                            } else {
                                if (res <= 20) {
                                    await reply(`Current MMI = ${res}
   High extreme fear zone (<20) suggests a good time to open fresh positions as markets are likely to be oversold and might turn upwards.
                                          `);
                                } else if (res > 20 && res <= 50) {
                                    await reply(`Current MMI = ${res}
  Fear zone suggests that investors are fearful in the market, but the action to be taken depends on the MMI trajectory. See all zones for details`)
                                } else if (res > 50 && res <= 80) {
                                    await reply(`Current MMI=${res}
  Greed zone suggests that investors are acting greedy in the market, but the action to be taken depends on the MMI trajectory. See all zones for details`)
                                } else {
                                    await reply(`Current MMI=${res}
  High extreme greed zone (>80) suggests to be cautious in opening fresh positions as markets are overbought and likely to turn downwards.`)

                                }

                            }
                        }).catch((err) => {
                            reply("nahi chala");
                        })


                        break
                    /* ------------------------------- CASE: DELETE ------------------------------ */
                    case "delete":
                    case "d":
                        try {
                            if (!mek.message.extendedTextMessage) {
                                reply(`❌ Tag message of bot to delete.`);
                                return;
                            }
                            if (
                                botNumber == mek.message.extendedTextMessage.contextInfo.participant) {
                                const chatId = mek.message.extendedTextMessage.contextInfo.stanzaId;
                                await conn.deleteMessage(from, {
                                    id: chatId,
                                    remoteJid: from,
                                    fromMe: true,
                                });
                            } else {
                                reply(`❌ Tag message of bot to delete.`);
                            }
                        } catch (err) {
                            console.log(err);
                            reply(`❌ Error!`);
                        }
                        break



                    /* ------------------------------- CASE: SONG ------------------------------ */
                    case "song":
                        if (!isGroup) {
                            reply("❌ Group command only!");
                            return;
                        }
                        if (args.length === 0) {
                            reply(`❌ Query is empty! \nSend ${prefix}song query`);
                            return;
                        }
                        try {
                            let randomName = getRandom(".mp3");
                            let query = args.join("%20");
                            let response = await downloadSong(randomName, query);
                            if (response == "NOT") {
                                reply(
                                    `❌ Song not found!\nTry to put correct spelling of song along with singer name.\n[Better use ${prefix}yta command to download correct song from youtube]`
                                );
                                return;
                            }
                            console.log(`song saved-> ./${randomName}`, response);

                            await conn.sendMessage(
                                from,
                                fs.readFileSync(`./${randomName}`),
                                MessageType.document,
                                {
                                    mimetype: "audio/mpeg",
                                    filename: response + ".mp3",
                                    quoted: mek,
                                }
                            );
                            fs.unlinkSync(`./${randomName}`);
                        } catch (err) {
                            console.log(err);
                            reply(`❌ There is some problem.`);
                        }
                        break


                    /////////////// ADMIN COMMANDS \\\\\\\\\\\\\\\
                    //reply = reply with tag 
                    //costum("ourTEXT",text) = reply without tagging
                    case 'spam':
                        if (!isGroup) return;
                        console.log("SPAM ARGS:", args)
                        if (args.length < 2) {
                            console.log("Insufficient arguments!");
                            break
                        }
                        console.log("SENDER NUMB:", senderNumb);

                        if (allowedNumbs.includes(senderNumb)) {

                            let count = Number(args[0]);
                            let msgToSpam = args[1];
                            let i = 0;
                            for (i = 2; i < args.length; ++i) msgToSpam += " " + args[i];

                            console.log("MSG TO SPAM: ", msgToSpam);
                            i = 0
                            while (i < count && i < 100) {
                                //reply(msgToSpam);
                                await costum(msgToSpam, text);
                                ++i;
                            }
                        }
                        else {
                            await reply("*Baka* NOT ALLOWED TO SPAM,Contact Developers!");
                        }
                        break

                    case 'news':
                        if (!isGroup) return;
                        console.log("SENDER NUMB:", senderNumb);
                        if (args[0]) {
                            var topic = args[0]
                            let s = await postNews(topic); //
                            reply(s);
                        } else {
                            let news = await getNews();
                            reply(news);
                        }
                        break

                    case 'add':
                        if (!isGroup) return;
                        if (!isGroupAdmins) {
                            reply("Saale khud ko admin samjhta hai kya?😂");
                            return;
                        }
                        if (!isBotGroupAdmins) return reply(errors.admin_error);
                        if (args.length < 1) return;
                        var num = '';
                        if (args.length > 1) {
                            for (let j = 0; j < args.length; j++) {
                                num = num + args[j]
                            }
                            num = `${num.replace(/ /g, '')}@s.whatsapp.net`
                        } else {
                            num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
                        }
                        if (num.startsWith('+')) {
                            num = `${num.split('+')[1]}`
                        }
                        const response = await conn.groupAdd(from, [num])
                        get_status = `${num.split('@s.whatsapp.net')[0]}`
                        get_status = response[`${get_status}@c.us`];
                        if (get_status == 400) {
                            reply('_❌ ERROR: Invalid number! ❌_');
                        }
                        if (get_status == 403) {
                            reply('_❌ ERROR: Number has privacy on adding group! ❌_');
                        }
                        if (get_status == 408) {
                            reply('_❌ ERROR: Number has left the group recently! ❌_');
                        }
                        if (get_status == 409) {
                            reply('_❌ ERROR: Number is already exists! ❌_');
                        }
                        if (get_status == 500) {
                            reply('_❌ ERROR: Group is currently full! ❌_');
                        }
                        if (get_status == 200) {
                            reply('_✔ SUCCESS: Number added to group! ✔_');
                        }
                        break;

                    case 'kick':
                    case 'remove':
                    case 'ban':
                        if (!isGroup) return;
                        if (!isGroupAdmins) {
                            reply("Saale khud ko admin samjhta hai kya?😂");
                            return;
                        }
                        if (!isBotGroupAdmins) return reply(errors.admin_error);
                        if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return;
                        mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
                        if (groupAdmins.includes(`${mentioned}`) == true) return;
                        if (mentioned.length > 1) {
                            return;
                        } else {
                            conn.groupRemove(from, mentioned)
                        }
                        break;

                    case 'promote':
                        if (!isGroup) return;

                        if (!isGroupAdmins) {
                            reply("Saale khud ko admin samjhta hai kya?😂");
                            return;
                        }
                        if (!isBotGroupAdmins) return reply(errors.admin_error);
                        if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return;
                        mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
                        if (groupAdmins.includes(`${mentioned}`) == true) return;
                        if (mentioned.length > 1) {
                            return;
                        } else {
                            conn.groupMakeAdmin(from, mentioned)
                        }
                        break;

                    case 'demote':
                        if (!isGroup) return;
                        if (!isGroupAdmins) {
                            reply("Saale khud ko admin samjhta hai kya?😂");
                            return;
                        }
                        if (!isBotGroupAdmins) return reply(errors.admin_error);
                        if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('_⚠ USAGE: /demote <@mention> ⚠_');
                        mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
                        if (groupAdmins.includes(`${mentioned}`) == false) return;
                        if (mentioned.length > 1) {
                            return;
                        } else {
                            conn.groupDemoteAdmin(from, mentioned)
                        }
                        break;

                    case 'chat':
                        if (!isGroup) return;
                        if (!isGroupAdmins) {
                            reply("Saale khud ko admin samjhta hai kya?😂");
                            return;
                        }
                        if (!isBotGroupAdmins) return reply(errors.admin_error);
                        if (args.length < 1) return;
                        if (args[0] == 'on') {
                            conn.groupSettingChange(from, GroupSettingChange.messageSend, false);
                        } else if (args[0] == 'off') {
                            conn.groupSettingChange(from, GroupSettingChange.messageSend, true);
                        } else {
                            return;
                        }
                        break;

                    case 'rename':
                        if (!isGroup) return;
                        if (!isGroupAdmins) {
                            reply("Saale khud ko admin samjhta hai kya?😂");
                            return;
                        }
                        if (!isBotGroupAdmins) return reply(errors.admin_error);
                        if (args.length < 1) return;
                        get_subject = '';
                        for (i = 0; i < args.length; i++) {
                            get_subject = get_subject + args[i] + ' ';
                        }
                        conn.groupUpdateSubject(from, get_subject);
                        break;

                    case 'removebot':
                        if (!isGroup) return;
                        if (!isGroupAdmins) {
                            reply("Saale khud ko admin samjhta hai kya?😂");
                            return;
                        }
                        conn.groupLeave(from)
                        break;

                    default:
                        reply(`*Bakka*,Grow Up,I'll not always be there for you.Use *-blend* for Assistance`)//Please Enter the valid commands,Like */blend*
                        break;
                }
            }
        } catch (e) {
            console.log('Error : %s', e)
        }
    })
}
main()
