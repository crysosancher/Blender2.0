// WEB SERVER
const express = require('express')
const server = express()
const axios = require('axios');
const https = require("https");
const ud = require('urban-dictionary')
const inshorts = require('inshorts-api');
const fs = require('fs');
const deepai = require('deepai');
const ytdl = require('ytdl-core');
// const yahooStockPrices = require('yahoo-stock-prices');
const deepAI = process.env.DEEPAI_KEY;
const port = process.env.PORT || 8000;
server.get('/', (req, res) => { res.send('V-Bot server running...') })
server.listen(port, () => {
    //     console.clear()
    console.log('\nWeb-server running!\n')
})

//loading plugins
const { getGender } = require('./plugins/gender') //gender module
const { getAnimeRandom } = require('./plugins/anime') //anime module
const { getFact } = require('./plugins/fact') //fact module
const { downloadAll, downloadholly, downloadbolly } = require('./plugins/movie') //movie module
const { setCountWarning, getCountWarning, removeWarnCount } = require('./DB/warningDB') // warning module
const { getBlockWarning, setBlockWarning, removeBlockWarning } = require('./DB/blockDB') //block module 
const { userHelp, StockList, adminList } = require('./plugins/help') //help module
const { getRemoveBg } = require('./plugins/removebg'); // removebg module
const { downloadmeme } = require('./plugins/meme') // meme module
// const bothelp = '918318585418-1614183205@g.us';
const { getCricketScore } = require("./plugins/cricket");
const { getScoreCard } = require("./plugins/cricketScoreCard");

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

const {
    setCountMember,
    getCountGroups,
    getCountGroupMembers,
    getCountIndividual,
    getCountIndividualAllGroup,
    getCountIndividualAllGroupWithName,
    getCountTop,
} = require("./DB/countMessDB");

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
const WSF = require('wa-sticker-formatter');//sticker module

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

/*****************|SONG|*****************/
const findSong = async (sname) => {
    const yts = require('yt-search')
    const r = await yts(`${sname}`)
    const videos = r.videos.slice(0, 3)
    let st = videos[0].url;
    return st;
}


// BASIC SETTINGS
prefix = '-';
const OwnerNumb = process.env.myNumber + '@s.whatsapp.net';
source_link = '```Base Link => https://github.com/crysosancher/Blender2.0```';
source_link_mod = '```Updated Link => https://github.com/jacktheboss220/Blender2.0```';

// LOAD CUSTOM FUNCTIONS
const getGroupAdmins = (participants) => {
    admins = []
    for (let i of participants) {
        i.isAdmin ? admins.push(i.jid) : ''
    }
    return admins
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

// const cric = async (Mid) => {
//     var confiq = {
//         method: 'GET',
//         url: `https://cricket-api.vercel.app/cri.php?url=https://www.cricbuzz.com/live-cricket-scores/${Mid}/33rd-match-indian-premier-league-2021`
//     }
//     let ms;
//     await axios.request(confiq).then((res) => {
//         ms = res.data.livescore;
//     }).catch((err) => {
//         return;
//     })
//     return ms;
// }
// const daaa = async (sto) => {
//     var s = '';
//     await yahooStockPrices.getCurrentData(`${sto}`).then((res) => {
//         console.log(res);
//         s = `*STOCK* :- _${sto}_
//   *Currency* :- _${res.currency}_                   
//   *Price*:- _${res.price}_`;
//     }).catch((err) => {
//         s = 'Not Found';
//     });
//     return s;
// };




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
    const OwnerSend = (teks) => {
        conn.sendMessage(
            OwnerNumb,
            teks,
            MessageType.text
        )
    }
    conn.on('group-participants-update', (anu) => {
        try {
            conn.groupMetadata(anu.jid).then((res) => {
                OwnerSend(`*Action:* ${anu.action} \n*Group:* ${anu.jid} \n*Grp Name:* ${res.subject} \n*Participants:* ${anu.participants[0]}`);
            })
            console.log(anu);
            // if (anu.action == 'add') {
            //     OwnerSend(`*Group:* ${anu.jid} \n*Grp Name:* ${mdata.subject} \n*Participants:* ${anu.participants[0]}`);
            // }
            // if (anu.action == 'remove') {
            //     OwnerSend(`*Group:* ${anu.jid} \n*Grp Name:* ${mdata.subject} \n*Participants:* ${anu.participants[0]}`);
            // }
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

            const birthday = new Date().toLocaleTimeString();
            let hou = parseInt(birthday.split(":")[0]) + 5;// birthday.getHours();
            let minu = parseInt(birthday.split(":")[1]) + 30;// birthday.getMinutes();
            let sec = parseInt(birthday.split(":")[2]); //birthday.getSeconds()
            if (minu > 59) {
                hou = hou + parseInt(minu / 60);
                minu = parseInt(minu % 60);
            }
            const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
            const args = body.trim().split(/ +/).slice(1)
            const ev = body.trim().split(/ +/).slice(1).join(' ')
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
            const isBotGroupAdmins = groupAdmins.includes(botNumber)
            const isGroupAdmins = groupAdmins.includes(sender)

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
            const sendText = (message) => {
                conn.sendMessage(from, message, MessageType.text);
            };


            let matchIdGroups = {}; //to store every group name with its match ID
            let cricSetIntervalGroups = {}; //to store every group name with its setInterval value so that it can be stopped
            let cricStartedGroups = {}; //to store every group name with boolean value to know if cricket score is already started or not
            /* -------------------------- CRICKET HELPING FUNCTIONS ------------------------- */
            const stopcHelper = () => {
                reply("✔️ Stopping Cricket scores for this group !");
                console.log("Stopping Cricket scores for " + groupName);
                clearInterval(cricSetIntervalGroups[groupName]);
                cricStartedGroups[groupName] = false;
            };

            //return false when stopped in middle. return true when run fully
            const startcHelper = async (commandName, isFromSetInterval = false) => {
                if (!groupDesc) {
                    conn.sendMessage(
                        from,
                        `❌
- Group description is empty.
- Put match ID in starting of group description. 
- Get match ID from cricbuzz today match url.
- example: https://www.cricbuzz.com/live-cricket-scores/37572/mi-vs-kkr-34th-match-indian-premier-league-2021 
- so match ID is 37572 !
# If you've put correct match ID in description starting and still facing this error then contact developer by !dev`,
                        MessageType.text,
                        {
                            quoted: mek,
                            detectLinks: false,
                        }
                    );
                    return false;
                }

                matchIdGroups[groupName] = groupDesc.slice(0, 5);
                if (commandName === "startc" && !isFromSetInterval) {
                    reply(
                        "✔️ Starting Cricket scores for matchID: " +
                        matchIdGroups[groupName] +
                        " (taken from description)"
                    );
                }

                let response = await getCricketScore(
                    matchIdGroups[groupName],
                    commandName
                );

                //response.info have "MO" only when command is startc
                if (commandName === "startc" && response.info === "MO") {
                    sendText(response.message);
                    reply("✔️ Match over! Stopping Cricket scores for this group !");
                    console.log("Match over! Stopping Cricket scores for " + groupName);
                    clearInterval(cricSetIntervalGroups[groupName]);
                    cricStartedGroups[groupName] = false;
                    return false;
                } else if (commandName === "startc" && response.info === "IO") {
                    sendText(response.message);
                    reply(
                        "✔️ Inning over! Open again live scores later when 2nd inning will start by !startc"
                    );
                    stopcHelper();
                    return false;
                } else if (response.info === "ER") {
                    conn.sendMessage(
                        from,
                        `❌
- Group description starting is "${matchIdGroups[groupName]}"
- Put match ID in starting of group description. 
- Get match ID from cricbuzz today match url.
- example: https://www.cricbuzz.com/live-cricket-scores/37572/mi-vs-kkr-34th-match-indian-premier-league-2021 
- so match ID is 37572 !
# If you've put correct match ID in description starting and still facing this error then contact developer by !dev`,
                        MessageType.text,
                        {
                            quoted: mek,
                            detectLinks: false,
                        }
                    );
                    return false;
                }
                sendText(response.message);
                return true;
            };

            //------------------------JOKE--------------------//
            /*********************************JOKE ******************/
            async function jokeFun(take) {
                const baseURL = "https://v2.jokeapi.dev";
                const categories = (!take) ? "Any" : take;
                const cate = ["Programming", "Misc", "Dark", "Pun", "Spooky", "Chrimstmas"]
                if (categories != "Any" && !(cate.includes(take))) return reply(`*Wrong Categories*\n *_Type any one_* :  *${cate}*`);
                const params = "blacklistFlags=religious,racist";
                https.get(`${baseURL}/joke/${categories}?${params}`, res => {
                    res.on("data", chunk => {
                        // On data received, convert it to a JSON object
                        let randomJoke = JSON.parse(chunk.toString());
                        if (randomJoke.type == "single") {
                            // If type == "single", the joke only has the "joke" property
                            mess = 'Category => ' + randomJoke.category + '\n\n' + randomJoke.joke;
                            reply(mess);
                        }
                        else {
                            // If type == "twopart", the joke has the "setup" and "delivery" properties
                            mess = 'Category => ' + randomJoke.category + '\n\n' + randomJoke.setup + '\n' + randomJoke.delivery;
                            reply(mess);
                        }
                        console.log("Categories => ", categories);
                    });
                    res.on("error", err => {
                        // On error, log to console
                        replay("Error!! Try again Later");
                        console.error(`Error: ${err}`);
                    });
                });
            }

            //-------------------------ADVICE--------------//
            async function getRandomAD() {
                await axios(`https://api.adviceslip.com/advice`).then((res) => {
                    reply(`_*-Advice-*_ \n` + res.data.slip.advice);
                }).catch((error) => {
                    console.log('error', error);
                    reply(`Error`);
                })
            }
            //------------------------NSFW----------------//
            async function getcall() {
                await deepai.callStandardApi("nsfw-detector", {
                    image: fs.createReadStream(`${media}`),
                }).then((res) => {
                    let mess = `*Nsfw Score* : ${res.output.nsfw_score}\n`;
                    console.log('NSFW Score : ', res.output.nsfw_score);
                    if (res.output.detections.length > 0) {
                        for (let i = 0; i < res.output.detections.length; i++) {
                            mess += `*Nsfw* : ${res.output.detections[i].name} : ${res.output.detections[i].confidence}%\n`;
                        }
                        reply(mess);
                    } else
                        reply(mess);
                }).catch((res) => {
                    console.log("error ", res);
                    reply(`*Website error*`);
                });
            }

            if (isGroup) {
                let user = conn.contacts[sender];
                let username = user
                    ? user.notify ||
                    user.vname ||
                    user.name ||
                    sender.split("@")[0]
                    : sender.split("@")[0];
                setCountMember(sender, from, username);
            }

            const isMedia = (type === 'imageMessage' || type === 'videoMessage')
            const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
            const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
            const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
            let senderNumb = sender.split('@')[0];
            //console.log("SENDER NUMB:", senderNumb);
            let groupDesc = groupMetadata.desc;
            let blockCommandsInDesc = []; //commands to be blocked
            if (groupDesc) {
                let firstLineDesc = groupDesc.split("\n")[0];
                blockCommandsInDesc = firstLineDesc.split(",");
            }


            if (!isGroup) {
                if (!allowedNumbs.includes(senderNumb))
                    reply(`❤️ Send by Bot => I don't work in direct message(dm). Pls Don't _Spam_ here. *Thanks ❤️*`);
            }
            if (isCmd) {
                console.log('[COMMAND]', command, '[FROM]', sender.split('@')[0], '[IN]', groupName, 'type=', typeof (args), hou, minu, sec)
                OwnerSend(command + ' *in* ' + groupName + ' *by* ' + senderNumb + ' *Time :* ' + hou + ' ' + minu + ' ' + sec)
                if (blockCommandsInDesc.includes(command)) {
                    reply("❌ Command blocked for this group!");
                    return;
                }
                let blockCount = await getBlockWarning(sender);
                if (blockCount == 1) return reply(`You cann't use the bot as u are *blocked*.`);
                /////////////// COMMANDS \\\\\\\\\\\\\\\
                switch (command) {
                    /////////////// HELP \\\\\\\\\\\\\\\
                    case 'help':
                    case 'acmd':
                        if (!isGroup) return;
                        await costum(userHelp(prefix, groupName), text);
                        break
                    case 'admin':
                        if (!isGroup) return;
                        await costum(adminList(prefix, groupName), text);
                        break;

                    case 'removebg':
                        if (!isGroup) return;
                        if ((isMedia && !mek.message.videoMessage || isQuotedImage)) {
                            const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
                            const media = await conn.downloadAndSaveMediaMessage(encmedia)
                            reply(`*Removing Backgroung....*`);
                            getRemoveBg(media).then(() => {
                                conn.sendMessage(
                                    from,
                                    fs.readFileSync("./bg.png"),
                                    MessageType.image,
                                    {
                                        mimetype: Mimetype.png,
                                        caption: `*Removed!!*`,
                                        quoted: mek,
                                    }
                                )
                                fs.unlinkSync("./bg.png");
                            }).catch((err) => {
                                OwnerSend('*RemoveBG ERROR :* ' + err)
                                console.log('Status : ', err.status);
                                reply(`Website Error, Tag Owner or Mod : \n Need to change api key.`)
                            });
                        }
                        else {
                            reply(`Reply to image only.`);
                        }
                        break;

                    case 'stock':
                        if (!isGroup) return;
                        await costum(StockList(prefix, groupName), text);
                        break

                    case 'a':
                    case 'alive':
                        if (!isGroup) return;
                        reply("```🤖 Yes Vro 🤖```\n（づ￣3￣）づ╭❤️～\n*Zinda hu Bas Kaam bol*");
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

                    case 'advice':
                        if (!isGroup) return;
                        getRandomAD();
                        break;

                    case 'tts':
                        if (!isGroup) return;
                        var take = args[0];
                        for (i = 1; i < args.length; i++) {
                            take += " " + args[i];
                        }
                        OwnerSend(take + " =tts message");
                        let uri = encodeURI(take);
                        async function getTTS() {
                            await axios.get(
                                "https://api.xteam.xyz/attp?file&text=" + uri,
                                { responseType: "arraybuffer" }
                            ).then((ttinullimage) => {
                                conn.sendMessage(
                                    from,
                                    Buffer.from(ttinullimage.data),
                                    MessageType.sticker,
                                    { mimetype: Mimetype.webp }
                                );
                            }).catch(() => {
                                reply(`_Website is Down_\nWait for Sometime`);
                            });
                        }
                        getTTS();
                        break;

                    case 'meme':
                        if (!isGroup) return;
                        reply(`*Sending...*`);
                        const memeURL = 'https://meme-api.herokuapp.com/gimme';
                        axios.get(`${memeURL}`).then((res) => {
                            let url = res.data.url;
                            if (url.includes("jpg") || url.includes("jpeg") || url.includes("png")) {
                                conn.sendMessage(
                                    from,
                                    { url: res.data.url },
                                    MessageType.image,
                                    {
                                        mimetype: Mimetype.jpg,
                                        caption: `${res.data.title}`,
                                        quoted: mek,
                                    }
                                );
                            }
                            else {
                                // downloadmeme(res.data.url).then(() => {
                                // const buffer = fs.readFileSync("./pic.mp4") // load some gif
                                // const options = {
                                //     gifPlayback: true,
                                //     mimetype: Mimetype.gif,
                                //     caption: `${res.data.url}`
                                // } // some metadata & caption
                                conn.sendMessage(
                                    from,
                                    { url: res.data.url },
                                    MessageType.video,
                                    {
                                        mimetype: Mimetype.gif,
                                        gifPlayback: true,
                                        caption: `${res.data.url}`
                                    }
                                )
                                // fs.unlinkSync("./pic.mp4");
                                // });
                            }
                        }).catch(() => {
                            console.log('Error');
                            reply(`Eror. Contect Dev.`);
                        });
                        break;

                    /* ------------------------------- CASE: TOIMG ------------------------------ */
                    case "toimg":
                    case "image":
                        if (!isGroup) {
                            reply("❌ Group command only!");
                            return;
                        }
                        if (!mek.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.isAnimated) {
                            const mediaToImg = await conn.downloadAndSaveMediaMessage({
                                message:
                                    mek.message.extendedTextMessage.contextInfo.quotedMessage,
                            });
                            ffmpeg(`./${mediaToImg}`)
                                .fromFormat("webp_pipe")
                                .save("result.png")
                                .on("error", (err) => {
                                    console.log(err);
                                    reply(
                                        "❌ There is some problem!\nOnly non-animated stickers can be convert to image!"
                                    );
                                })
                                .on("end", () => {
                                    conn.sendMessage(
                                        from,
                                        fs.readFileSync("result.png"),
                                        MessageType.image,
                                        {
                                            mimetype: Mimetype.png,
                                            quoted: mek,
                                        }
                                    );
                                    fs.unlinkSync("result.png");
                                });
                        } else {
                            reply(
                                "❌ There is some problem!\nOnly non-animated stickers can be convert to image!"
                            );
                        }
                        break;

                    case 'joke':
                        if (!isGroup) return;
                        jokeFun(args[0]);
                        break;

                    case 'anime':
                        if (!isGroup) return;
                        var name = ev;
                        OwnerSend("Args : " + name);
                        if (name.includes('name')) {
                            getAnimeRandom('quotes/character?name=' + name.toLowerCase().substring(4).trim().split(" ").join("+")).then((message) => {
                                reply(message);
                            }).catch((error) => {
                                reply(error);
                            });
                        } else if (name.includes('title')) {
                            mess = getAnimeRandom('quotes/anime?title=' + name.toLowerCase().substring(6).trim().split(" ").join("%20")).then((message) => {
                                reply(message);
                            }).catch((error) => {
                                reply(error);
                            });
                        } else {
                            getAnimeRandom('random').then((message) => {
                                reply(message);
                            }).catch((error) => {
                                reply(error);
                            })
                        }
                        break;

                    case 'fb':
                        if (!isGroup) return;
                        if (!args[0]) return reply(`Enter url after ${prefix}fb`);
                        var faceURL = args[0];
                        if (faceURL.includes("?app"))
                            faceURL = faceURL.split("?app")[0];
                        if (!faceURL.endsWith("/"))
                            faceURL += "/";
                        OwnerSend('Downloading : ' + faceURL);
                        axios(`https://api.neoxr.eu.org/api/fb?url=${faceURL}&apikey=jeKTkg7b`).then((res) => {
                            reply(`_Downloading.._\nIf video is more then 100Mb Bot will not send it.`);
                            let Url = res.data.data[1].url;
                            if (Url == null || Url == '')
                                Url = res.data.data[0].url;
                            conn.sendMessage(
                                from,
                                { url: Url },
                                MessageType.video,
                                {
                                    mimetype: Mimetype.mp4,
                                    caption: "Here.",
                                    quoted: mek
                                }
                            );
                            console.log('Sent');
                        }).catch(() => {
                            console.log("ERROR");
                            reply(`*_Error_* Enter valid url or Only Public post can be downloaded.`);
                        })
                        break;

                    case 'sticker':
                    case 's':
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
                            packName = "Bit"
                        }
                        if (authorName == "") {
                            authorName = "Bot"
                        }
                        outputOptions = [`-vcodec`, `libwebp`, `-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`];
                        if ((args.includes('crop') == true) || (args.includes('c') == true)) {
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
                        else {
                            reply(`❌*Error reply to image or video only*\n*Send Again the Media*`);
                            console.log('error not replyed');
                        }
                        break;

                    case 'movie':
                        if (!isGroup) return;
                        if (!args[0]) return reply(`Provide Movie name.`);
                        let movie = body.trim().split(/ +/).slice(1).join('+');
                        OwnerSend("Movie : " + movie);
                        let MovieUrl = '';
                        await downloadAll('`' + movie).then((message) => {
                            MovieUrl += message + "\n\n";
                        }).catch(() => { });
                        await downloadbolly('`' + movie).then((message) => {
                            MovieUrl += message + "\n\n";
                        }).catch(() => { });
                        await downloadholly('`' + movie).then((message) => {
                            MovieUrl += message + "\n\n";
                        }).catch(() => { });
                        if (MovieUrl != '')
                            reply(`*Direct link for*😊 ${movie.split("+").join(" ")}\n\n` + MovieUrl);
                        else {
                            console.log("Not Found!!");
                            reply(`*Sorry* No Movie Found\nCheck your _spelling or try another movie_.`);
                        }
                        break;

                    case 'nsfw':
                        if (!isGroup) return;
                        if ((isMedia && !mek.message.videoMessage || isQuotedImage)) {
                            const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
                            const media = await conn.downloadAndSaveMediaMessage(encmedia)
                            deepai.setApiKey(deepAI);
                            getcall()
                        }
                        else {
                            reply(`*Reply to image only*`);
                            console.log("Error not replyed");
                        }
                        break;

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
                        break;

                    case 'idp':
                        if (!isGroup) return;
                        if (!args[0]) return reply(`_Enter User name after idp_`);
                        let prof = args[0];
                        const idp = async (prof) => {
                            axios({
                                url: `https://www.instagram.com/${prof}/?__a=1`,
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
                                        'ig_did=305179C0-CE28-4DCD-847A-2F28A98B7DBF; ig_nrcb=1; mid=YQBN3wAEAAGfSSDsZYS9nf2a5MHO; csrftoken=KItbBYAsObQgmJU2CsfqfiRFtk8JXwgm; sessionid=29386738134%3A8NwzjrA3jruVB4%3A23; ds_user_id=29386738134; fbm_124024574287414=base_domain=.instagram.com; shbid="18377\05429386738134\0541674226938:01f7d2db0f9c512fc79336716e1cf02623129a7897f5ccb8d878999be86c0e010bb77920"; shbts="1642690938\05429386738134\0541674226938:01f73e613a6030436ef5f2cea6c7402b82a96c1a61f905b746d3951f49a7f2d2eab6d399"; fbsr_124024574287414=Ps5NinG2AjNMV4W927e_vwMrZVLCltfcbWGS3B5S3to.eyJ1c2VyX2lkIjoiMTAwMDA5NDY1ODIwODQyIiwiY29kZSI6IkFRQlZrOVljMF9DS24tVEpqZ21VWjdPT2dOelFVdkJyLXUzaENSOGR0RzZrbVQxdWszYUMtVDZJeV9QWjBCc1lCcTBmZkxNZmsyUVlMM0hMVGVhQ1pxb1RRQzdsOE9BYlZKdmlvTU5GZ0dncVdxZVQzNV9JM3ZOV0pCR3BsWXVQX0dGMDJMMEt2aTk4WXpxNFhrVWhaVUNRanpPcUthN01aOVdZaVc5SVFzZjRxU3FQTXUzVXlwRWVsMXQ4TjJkV2ZHSnNFYXRsNXBIRXBGMlJSSWljY0F1c3BTZHNPdWFZSThCeV9uRFpjQklUUFk0RzNJY0NiYnFtdXNFZXY5ZUlsMVlZQ0E0bE5ROWxyeGtZdU1IM05scWRFTmtlQjNwWVRjRGlsZDZtekNpNFgzcnZIZUtUMFVFNkJFYVlURFpCTmhaOTd5TmJWT1R1ZENWdk84UlFoYjV2Iiwib2F1dGhfdG9rZW4iOiJFQUFCd3pMaXhuallCQU0zaHBjU2lKUm50WWcyTm0xamhlUlFkd3VCeExaQ1V0UjV5endGSkdVQVpDbERGRThwdXdaQXRPMkxtQnMxNjNiVGQzZERhRVl3UGRiWHY1bE5PNEZaQVVoYUpBZDBIcTQyWkN5OVdicXh4blVnZml5MHBETm9rMXlQVzlUNHpaQVVsbHVGcmZ4OFFhRlRnZG9wRTBFMDBMaGg3OVhuWkN1QldteWZ0MlpBY1NYVUpMRjNWNzUwWkQiLCJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImlzc3VlZF9hdCI6MTY0MjY5NDAyM30; rur="VLL\05429386738134\0541674231548:01f7816fe2a5156acdb86c5eff76c0ae83ac053646c44ccc592f854fb9d24a18bfcfc3ac"',
                                },
                                referrerPolicy: 'strict-origin-when-cross-origin',
                                body: null,
                                mode: 'cors',
                                method: 'GET'
                            }).then((res) => {
                                reply(`_Searching User..._`);
                                conn.sendMessage(
                                    from,
                                    { url: res.data.graphql.user.profile_pic_url_hd },
                                    MessageType.image,
                                    {
                                        mimetype: Mimetype.jpg,
                                        caption: `${prof}`,
                                        quoted: mek
                                    }
                                )
                            }).catch((error) => {
                                console.log(error);
                                reply(`_Bad Luck_ :(\nGetting login page!!`);
                            })
                        }
                        idp(prof);
                        break;

                    case 'fact':
                        if (!isGroup) return;
                        getFact().then((message) => {
                            reply(`✍️(◔◡◔)*Amazing Fact\n*` + message);
                        }).catch((Error) => {
                            reply("Error");
                        })
                        break;

                    case 'dice':
                        if (!isGroup) return;
                        let upper = 6
                        let lower = 1
                        let myRandom = Math.floor(Math.random() * (upper - lower + 1) + lower)
                        reply(`Hey,Your luck gives you:\n🎲${myRandom}🎲`)
                        break;

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
                        break;

                    case 'dic':
                        if (!isGroup) return;
                        let w = args[0]
                        const dice = await dictionary(w)
                        console.log(dice.word)
                        //console.log(dick)
                        reply(`*Term*:- ${dice.word}
  *Pronounciation*:- ${dice.phonetic}
  *Meaning*: ${dice.meanings[0].definitions[0].definition}
  *Example*: ${dice.meanings[0].definitions[0].example}`)
                        break;

                    /* ------------------------------- CASE: GENDER ------------------------------ */
                    case "gender":
                        if (!isGroup) {
                            reply("❌ Group command only!");
                            return;
                        }
                        if (args.length === 0) {
                            reply(`❌ Name is not given! \nSend ${prefix}gender firstname`);
                            return;
                        }
                        let namePerson = args[0];
                        if (namePerson.includes("@")) {
                            reply(`❌ Don't tag! \nSend ${prefix}gender firstname`);
                            return;
                        }
                        console.log('Name : ', name);
                        getGender(namePerson).then((message) => {
                            reply(message);
                        }).catch((error) => {
                            reply(error);
                        });
                        break;

                    case 'mp3':
                    case 'mp4audio':
                    case 'tomp3':
                        if (!isGroup) return;
                        if ((isMedia && mek.message.videoMessage || isQuotedVideo)) {
                            const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
                            const media = await conn.downloadAndSaveMediaMessage(encmedia)
                            const ff = require('ffmpeg')
                            reply(`*Converting...Pls Wait*`);
                            ff(media).then((video) => {
                                video.fnExtractSoundToMP3('./file.mp3', (error, file) => {
                                    if (!error) {
                                        conn.sendMessage(
                                            from,
                                            fs.readFileSync("./file.mp3"),
                                            MessageType.audio,
                                            {
                                                mimetype: 'audio/mp4',
                                                quoted: mek
                                            }
                                        )
                                    }
                                });
                                console.log('Sent');
                            }, function (err) {
                                console.log('Error: ' + err);
                            });
                        }
                        else {
                            console.log("No Media tag");
                            reply(`*Reply to video only*`)
                        }
                        break;

                    case 'yt':
                        if (!isGroup) return;
                        if (!args[0]) return reply(`Type url after ${prefix}yt`);
                        var url = args[0];
                        console.log(`${url}`)
                        try {
                            let info = await ytdl.getInfo(url)
                            let videotitle = info.videoDetails.title;
                            const path = `./${getRandom}.mp4`;
                            reply(`*Downloading Video.....*\n_This may take upto 1 to 2 min.._`)
                                const stream = ytdl(url, { filter: info => info.itag == 22 || info.itag == 18 })
                                    .pipe(fs.createWriteStream(path));
                                console.log("Video downloaded")
                                await new Promise((resolve, reject) => {
                                    stream.on('error', reject)
                                    stream.on('finish', resolve)
                                })
                                await conn.sendMessage(
                                    from,
                                    fs.readFileSync(path),
                                    MessageType.video,
                                    { mimetype: Mimetype.mp4, caption: `${videotitle}`, quoted: mek }
                                )
                            console.log("Sent ")
                            fs.unlinkSync(path)
                        } catch (error) {
                            reply(`Unable to download,contact dev.`);
                        }
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
                        reply(`${source_link}\n\n${source_link_mod}\nGive a _Star_ if you like the bot.❤️`)
                        break
                    case 'list':
                        if (!isGroup) return;
                        const row1 = [
                            { title: '-news national', description: "News About national category", rowId: "rowid1" },
                            { title: '-news sports', description: "News About sports category", rowId: "rowid2" },
                            { title: '-news world ', description: "News About world category", rowId: "rowid3" },
                            { title: '-news politics', description: "News About politics category", rowId: "rowid4" },
                            { title: '-news science', description: "News About science category", rowId: "rowid5" },
                            { title: '-news technology', description: "News About tech category", rowId: "rowid6" },
                            { title: '-news entertainment', description: "News About entertainment category", rowId: "rowid7" },
                            { title: '-news automobile', description: "News About automobile category", rowId: "rowid8" },
                        ]
                        const row2 = [
                            { title: '-horo aries', description: "Today's Horoscope ", rowId: "rowid1" },
                            { title: '-horo taurus', description: "Today's Horoscope", rowId: "rowid2" },
                            { title: '-horo gemini', description: "Today's Horoscope", rowId: "rowid3" },
                            { title: '-horo cancer', description: "Today's Horoscope", rowId: "rowid4" },
                            { title: '-horo leo', description: "Today's Horoscope", rowId: "rowid5" },
                            { title: '-horo virgo', description: "Today's Horoscope", rowId: "rowid6" },
                            { title: '-horo libra', description: "Today's Horoscope", rowId: "rowid7" },
                            { title: '-horo scorpio', description: "Today's Horoscope", rowId: "rowid8" },
                            { title: '-horo sagittarius', description: "Today's Horoscope", rowId: "rowid9" },
                            { title: '-horo capricorn', description: "Today's Horoscope", rowId: "rowid10" },
                            { title: '-horo aquarius', description: "Today's Horoscope", rowId: "rowid11" },
                            { title: '-horo pisces', description: "Today's Horoscope", rowId: "rowid12" },
                        ]


                        const sections = [{ title: "News Section", rows: row1 },
                        { title: "Horoscope Section ", rows: row2 }
                        ]

                        const button = {
                            buttonText: 'Blenders Magic ✨',
                            description: "      Enter inside my World 👽",
                            sections: sections,
                            listType: 1
                        }
                        const sendMsg = await conn.sendMessage(from, button, MessageType.listMessage)
                        break

                    case 'blend':
                        if (!isGroup) return;
                        const buttons = [
                            { buttonId: 'id1', buttonText: { displayText: '-help' }, type: 1 },
                            { buttonId: 'id2', buttonText: { displayText: '-news' }, type: 1 },
                            { buttonId: 'id3', buttonText: { displayText: '-list' }, type: 1 },
                        ]

                        const buttonMessage = {
                            contentText: "Hi,Check out my Features",
                            footerText: 'version-2.0',
                            buttons: buttons,
                            headerType: 1
                        }

                        const sendBMsg = await conn.sendMessage(from, buttonMessage, MessageType.buttonsMessage)
                        break;

                    case 'yta':
                        if (!isGroup) return;
                        if (!args[0]) return reply(`_Enter URl after yta_`);
                        var url1 = args[0];
                        console.log(`${url1}`)
                        const am = async (url1) => {
                            let info = ytdl.getInfo(url1)
                            let sany = getRandom('.mp3')
                            const stream = ytdl(url1, { filter: info => info.audioBitrate == 160 || info.audioBitrate == 128 })
                                .pipe(fs.createWriteStream(sany));
                            console.log("audio downloaded")
                            reply('*Downloading Audio.....*\nThis may take upto 1 or 2 min.');
                            await new Promise((resolve, reject) => {
                                stream.on('error', reject)
                                stream.on('finish', resolve)
                            }).then(async (res) => {
                                await conn.sendMessage(
                                    from,
                                    fs.readFileSync(sany),
                                    MessageType.audio,
                                    { mimetype: Mimetype.mp4Audio, caption: `😪😪`, quoted: mek }
                                ).then((resolved) => {
                                    console.log("Sent ")
                                    fs.unlinkSync(sany)
                                }).catch((reject) => {
                                    reply('Audio Not Found or unable to download.')
                                })
                            }).catch((err) => {
                                reply`Unable to download,contact dev.`;
                            });
                        }
                        am(url1)
                        break;

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
                        if (args[0] == 'all' && !args[1])
                            return reply(`❌ URL is empty! \nSend ${prefix}insta all url`);
                        let urlInsta = args[0];
                        if (args[0] == 'all' || args[0] == 'All') urlInsta = args[1];
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
                            return;
                        }
                        if (urlInsta.includes("?"))
                            urlInsta = urlInsta.slice(0, urlInsta.search("\\?"));
                        OwnerSend("Downloading URL : " + urlInsta);
                        if (args[0].includes("insta")) {
                            reply(`*Downloading...Pls wait*`);
                            axios.get(`https://api.neoxr.eu.org/api/ig?url=${urlInsta}&apikey=jeKTkg7b`).then((res) => {
                                if (res.data.status == true) {
                                    if (res.data.data[0].type == "mp4") {
                                        conn.sendMessage(
                                            from,
                                            { url: res.data.data[0].url },
                                            MessageType.video,
                                            {
                                                mimetype: Mimetype.mp4,
                                                caption: `${res.data.caption}`,
                                                quoted: mek,
                                            }
                                        );
                                        console.log('Sent');
                                    } else if (res.data.data[0].type == "jpg") {
                                        conn.sendMessage(
                                            from,
                                            { url: res.data.data[0].url },
                                            MessageType.image,
                                            {
                                                caption: `${res.data.caption}`,
                                                quoted: mek
                                            }
                                        );
                                        console.log('Sent');
                                    } else {
                                        reply(`❌ There is some problem!\nOr you can try again.`);
                                    }
                                }
                                else if (res.data.status == false) {
                                    console.log('Private Post');
                                    reply(`❌ There is some problem!\n  Private post and stories can not be downloaded`);
                                }
                                else {
                                    reply(`_Error website down_`);
                                }
                            }).catch(() => {
                                console.log('Error');
                                reply(`❌ There is some problem!\n *Website is Down* :(`);
                            })
                        }
                        else if (args[0] == 'all' || args[0] == 'All') {
                            reply(`*Downloading all...Pls wait*`);
                            axios.get(`https://api.neoxr.eu.org/api/ig?url=${urlInsta}&apikey=yourkey`).then((res) => {
                                if (res.data.status == true) {
                                    for (let i = 0; i < res.data.data.length; i++) {
                                        if (res.data.data[i].type == "mp4") {
                                            conn.sendMessage(
                                                from,
                                                { url: res.data.data[i].url },
                                                MessageType.video,
                                                {
                                                    mimetype: Mimetype.mp4,
                                                    caption: `Post : ${i + 1}`,
                                                    quoted: mek,
                                                }
                                            );
                                        } else if (res.data.data[i].type == "jpg") {
                                            conn.sendMessage(
                                                from,
                                                { url: res.data.data[i].url },
                                                MessageType.image,
                                                {
                                                    caption: `Post : ${i + 1}`,
                                                    quoted: mek
                                                }
                                            );
                                        } else {
                                            reply(`❌ There is some problem!\nOr you can try again.`);
                                        }
                                        console.log('Sent : ', (i + 1));
                                    }
                                }
                                else if (res.data.status == false) {
                                    console.log('Private Post');
                                    reply(`❌ There is some problem!\n  Private post and stories can not be downloaded`);
                                }
                                else {
                                    reply(`_Error website down_`);
                                }
                            }).catch(() => {
                                console.log('Error');
                                reply(`❌ There is some problem!\n   Private post and stories can not be downloaded`);
                            })
                        }
                        break;


                    case "pcount":
                    case "count":
                        if (isGroup) return reply(`Testing Phase`)
                        if (!isGroup) {
                            reply("❌ Group command only!");
                            return;
                        }
                        if (
                            mek.message.extendedTextMessage &&
                            mek.message.extendedTextMessage.contextInfo &&
                            mek.message.extendedTextMessage.contextInfo.participant
                        ) {
                            sender = mek.message.extendedTextMessage.contextInfo.participant;
                        }
                        try {
                            let indiCount = await getCountIndividual(sender, from);
                            if (!indiCount) indiCount = 0;
                            let user = conn.contacts[sender];
                            let username = user
                                ? user.notify || user.vname || user.name || sender.split("@")[0]
                                : sender.split("@")[0];
                            reply(
                                `${username} have _${indiCount} messages from 03 April_ in this group!`
                            );
                        } catch (err) {
                            console.log(err);
                        }
                        break;

                    /* --------------------------------- grpc --------------------------------- */
                    case "grpc":
                        if (!isGroup) {
                            reply("❌ Group command only!");
                            return;
                        }
                        if (OwnerNumb != sender) {
                            reply("❌ Owner command!");
                            return;
                        }
                        let resultCountGroup = await getCountGroups();
                        let countGroupMsg = `*🤖 All GROUP STATS 🤖*\n_From 03 April 2022_${readMore}\n`;
                        let countGroupMsgTemp = "\n";
                        let totalGrpCount = 0;
                        for (let group of resultCountGroup) {
                            try {
                                let mdgrp = await conn.groupMetadata(group.groupjid);
                                let grpName = mdgrp.subject;
                                totalGrpCount += Number(group.count);
                                countGroupMsgTemp += `\n${group.count} - ${grpName}`;
                            } catch (err) {
                                console.log("Error in getting metadata of " + group.groupjid);
                            }
                        }
                        countGroupMsg += `\n*Total Messages: ${totalGrpCount}*`;
                        countGroupMsg += countGroupMsgTemp;
                        reply(countGroupMsg);
                        break;

                    /* --------------------------------- grpm --------------------------------- */
                    case "mcount":
                    case "grpm":
                        if (!isGroup) {
                            reply("❌ Group command only!");
                            return;
                        }
                        if (!allowedNumbs.includes(senderNumb) || !isGroupAdmins) {
                            reply("❌ Admin command!");
                            return;
                        }

                        let resultCountGroupIndi = await getCountGroupMembers(from);

                        let memWithMsg = new Set();
                        for (let member of resultCountGroupIndi) {
                            memWithMsg.add(member.memberjid);
                        }

                        let countGroupMsgIndi = `*${groupName}*\n_From 03 April 2022_${readMore}\n`;

                        let countGroupMsgTempIndi = "\n";
                        let totalGrpCountIndi = 0;
                        for (let member of resultCountGroupIndi) {
                            totalGrpCountIndi += member.count;
                            let user = conn.contacts[member.memberjid];
                            let username = user
                                ? user.notify ||
                                user.vname ||
                                user.name ||
                                member.memberjid.split("@")[0]
                                : member.memberjid.split("@")[0];
                            countGroupMsgTempIndi += `\n${member.count} - ${username}`;
                        }

                        groupMembers.forEach((mem) => {
                            if (!memWithMsg.has(mem.jid)) {
                                let user = conn.contacts[mem.jid];
                                let username = user
                                    ? user.notify ||
                                    user.vname ||
                                    user.name ||
                                    mem.jid.split("@")[0]
                                    : mem.jid.split("@")[0];
                                countGroupMsgTempIndi += `\n${0} - ${username}`;
                            }
                        });

                        countGroupMsgIndi += `\n*Total Messages: ${totalGrpCountIndi}*`;
                        countGroupMsgIndi += countGroupMsgTempIndi;
                        reply(countGroupMsgIndi);
                        break;

                    /* --------------------------------- total --------------------------------- */
                    case "total":
                        if (isGroup) return reply(`Testing Phase`)
                        if (!isGroup) {
                            reply("❌ Group command only!");
                            return;
                        }
                        if (
                            mek.message.extendedTextMessage &&
                            mek.message.extendedTextMessage.contextInfo &&
                            mek.message.extendedTextMessage.contextInfo.participant
                        ) {
                            sender = mek.message.extendedTextMessage.contextInfo.participant;
                        }

                        try {
                            let indTotalCount = await getCountIndividualAllGroup(sender);
                            if (!indTotalCount) indTotalCount = 0;
                            let user = conn.contacts[sender];
                            let username = user
                                ? user.notify || user.vname || user.name || sender.split("@")[0]
                                : sender.split("@")[0];
                            reply(
                                `${username} have _${indTotalCount} messages from 03 March_ in all groups!`
                            );
                        } catch (err) {
                            console.log(err);
                        }
                        break;

                    /* --------------------------------- totalg --------------------------------- */
                    case "totalg":
                        if (isGroup) return reply(`Testing Phase`)
                        if (!isGroup) {
                            reply("❌ Group command only!");
                            return;
                        }
                        try {
                            if (
                                mek.message.extendedTextMessage &&
                                mek.message.extendedTextMessage.contextInfo &&
                                mek.message.extendedTextMessage.contextInfo.participant
                            ) {
                                sender = mek.message.extendedTextMessage.contextInfo.participant;
                            }
                            let resultCountGroup = await getCountIndividualAllGroupWithName(
                                sender
                            );
                            let user = conn.contacts[sender];
                            let username = user
                                ? user.notify || user.vname || user.name || sender.split("@")[0]
                                : sender.split("@")[0];
                            let countGroupMsg = `*🤖 ${username} GROUP STATS 🤖*\n_From 03 March 2022_${readMore}\n`;
                            let countGroupMsgTemp = "\n";
                            let totalGrpCount = 0;
                            for (let group of resultCountGroup) {
                                let grpName = group.gname;
                                totalGrpCount += Number(group.count);
                                countGroupMsgTemp += `\n${group.count} - ${grpName}`;
                            }
                            countGroupMsg += `\n*TotaL Messages: ${totalGrpCount}*`;
                            countGroupMsg += countGroupMsgTemp;
                            reply(countGroupMsg);
                        } catch (err) {
                            console.log(err);
                            reply("❌ Error");
                        }
                        break;

                    /* --------------------------------- zero --------------------------------- */
                    case "trash":
                        try {
                            if (!isGroup) {
                                reply("❌ Group command only!");
                                return;
                            }
                            if (!allowedNumbs.includes(senderNumb) || !isGroupAdmins) {
                                reply("❌ Admin command!");
                                return;
                            }
                            let resultCountGroupIndi = await getCountGroupMembers(from);
                            let memWithMsg = new Set();
                            for (let member of resultCountGroupIndi) {
                                memWithMsg.add(member.memberjid);
                            }
                            let zeroMsg = `${groupName}\nMembers with 0 message from 03 March:${readMore}\n`;
                            groupMembers.forEach((mem) => {
                                if (!memWithMsg.has(mem.jid)) {
                                    zeroMsg += `\n${mem.jid.split("@")[0]}`;
                                }
                            });
                            reply(zeroMsg);
                        } catch (err) {
                            console.log(err);
                        }
                        break;


                    case 'pin':
                        if (!isGroup) return;
                        if (args.length === 0) {
                            reply(`❌ URL is empty! \nSend ${prefix}pin url`);
                            return;
                        }
                        let urlPin = args[0];
                        if (
                            !(urlPin.includes("pin.it"))) {
                            reply(`❌ Wrong URL!`);
                            return;
                        }
                        console.log("Downloading URL : ", urlPin);
                        reply(`*Downloading...*`);
                        axios.get(`https://api.neoxr.eu.org/api/pin?url=${urlPin}/&apikey=jeKTkg7b`).then((res) => {
                            if (res.data.status == true) {
                                if (res.data.data.type == "mp4") {
                                    conn.sendMessage(
                                        from,
                                        { url: res.data.data.url },
                                        MessageType.video,
                                        {
                                            mimetype: Mimetype.mp4,
                                            quoted: mek,
                                        }
                                    );
                                    console.log('Sent');
                                } else if (res.data.data.type == "jpg") {
                                    conn.sendMessage(
                                        from,
                                        { url: res.data.data.url },
                                        MessageType.image,
                                        {
                                            quoted: mek
                                        }
                                    );
                                    console.log('Sent');
                                } else {
                                    reply(`❌ There is some problem!\nOr you can try again.`);
                                }
                            }
                            else if (res.data.status == false) {
                                console.log('Private Post');
                                reply(`❌ There is some problem!`);
                            }
                            else {
                                reply(`_Error website down_`);
                            }
                        }).catch(() => {
                            console.log('Error');
                        })
                        break;

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

                    case 'jid':
                        if (!isGroup) return;
                        if (!allowedNumbs.includes(senderNumb)) return;
                        // reply(from);
                        reply(groupMetadata.id)
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
                        break;

                    case 'stocks':
                        const s3 = await daaa(args[0].toUpperCase());
                        reply(`${s3}`)
                        break;


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
                        break;

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
                        break;

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
                        let uname = args;
                        const sonurl = await findSong(uname);
                        console.log(sonurl);
                        const gm = async (url1) => {
                            let info = ytdl.getInfo(url1)
                            let sany = getRandom('.mp3')
                            reply(`_Downloading Song.._\nThis may take upto 1 to 2 min.`);
                            const stream = ytdl(url1, { filter: info => info.audioBitrate == 160 || info.audioBitrate == 128 })
                                .pipe(fs.createWriteStream(sany));
                            console.log("Audio downloaded")
                            await new Promise((resolve, reject) => {
                                stream.on('error', reject)
                                stream.on('finish', resolve)
                            }).then(async (res) => {
                                await conn.sendMessage(
                                    from,
                                    fs.readFileSync(sany),
                                    MessageType.audio,
                                    { mimetype: Mimetype.mp4Audio, caption: 'Here.', quoted: mek }
                                ).then((resolved) => {
                                    console.log("Sent")
                                    fs.unlinkSync(sany)
                                }).catch((reject) => {
                                    reply(`_Enable to download send a valid req_`);
                                })
                            }).catch((err) => {
                                reply(`_Unable to download,contact dev_.`);
                            });
                        }
                        gm(sonurl)
                        break;

                    case "startc":
                        if (!isGroup) {
                            reply("❌ Group command only!");
                            return;
                        }
                        if (allowedNumbs.includes(senderNumb)) {
                            if (cricStartedGroups[groupName] == true) {
                                reply("❌ CRICKET SCORES already started for this group!");
                                return;
                            }

                            let respCric = await startcHelper("startc");
                            if (!respCric) return;

                            cricStartedGroups[groupName] = true;
                            cricSetIntervalGroups[groupName] = setInterval(async () => {
                                respCric = await startcHelper("startc", true);
                                if (!respCric) return;
                            }, 1000 * 60); //1 min
                        }
                        else {
                            reply('❌ Owner commad');
                        }
                        break;
                    /* ------------------------------- CASE: SCORE ------------------------------ */
                    case "score":
                        if (!isGroup) {
                            reply("❌ Group command only!");
                            return;
                        }

                        await startcHelper("score");
                        break;

                    /* ------------------------------- CASE: stopc ------------------------------  */
                    case "stopc":
                        if (!isGroup) {
                            reply("❌ Group command only!");
                            return;
                        }
                        if (allowedNumbs.includes(senderNumb)) {
                            if (cricStartedGroups[groupName] == true) stopcHelper();
                            else reply("❌ CRICKET scores was never started for this group!");
                        }
                        else {
                            reply('❌ Owner commad');
                        }
                        break;

                    /* ------------------------------- CASE: SCORECARD ------------------------------  */
                    case "scorecard":
                    case "scoreboard":
                    case "sc":
                    case "sb":
                        if (!isGroup) {
                            reply("❌ Group command only!");
                            return;
                        }
                        if (!groupDesc) {
                            conn.sendMessage(
                                from,
                                `❌ 
    - Group description is empty.
    - Put match ID in starting of group description. 
    - Get match ID from cricbuzz today match url.
    - example: https://www.cricbuzz.com/live-cricket-scores/37572/mi-vs-kkr-34th-match-indian-premier-league-2021 
    - so match ID is 37572 !
    
    # If you've put correct match ID in description starting and still facing this error then contact developer by !dev`,
                                MessageType.text,
                                {
                                    quoted: mek,
                                    detectLinks: false,
                                }
                            );
                            return false;
                        }

                        let scoreCardMessage = await getScoreCard(groupDesc.slice(0, 5));
                        if (scoreCardMessage) sendText(scoreCardMessage);
                        else
                            conn.sendMessage(
                                from,
                                `❌
    - Group description starting is "${matchIdGroups[groupName]}"
    - Put match ID in starting of group description. 
    - Get match ID from cricbuzz today match url.
    - example: https://www.cricbuzz.com/live-cricket-scores/37572/mi-vs-kkr-34th-match-indian-premier-league-2021 
    - so match ID is 37572 !
    # If you've put correct match ID in description starting and still facing this error then contact developer by !dev`,
                                MessageType.text,
                                {
                                    quoted: mek,
                                    detectLinks: false,
                                }
                            );

                        break;

                    /////////////// ADMIN & OWNER COMMANDS \\\\\\\\\\\\\\\
                    //reply = reply with tag 
                    //costum("ourTEXT",text) = reply without tagging

                    case 'tagall':
                        if (!isGroup) return;
                        OwnerSend("SENDER NUMB:" + senderNumb);
                        if (allowedNumbs.includes(senderNumb) || isGroupAdmins) {
                            let jids = [];
                            let mesaj = (!args[0]) ? '' : ev + '\n\n';
                            var id;
                            for (let i of groupMembers) {
                                mesaj += '⟪ @' + i.id.split('@')[0] + ' \n';
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

                    case 'getwarn':
                        if (!mek.message.extendedTextMessage) {
                            reply("❌ Tag someone! or want to know your count reply on your message");
                            return;
                        }
                        try {
                            let mentioned =
                                mek.message.extendedTextMessage.contextInfo.mentionedJid;
                            if (mentioned) {
                                //when member are mentioned with command
                                OwnerSend("Target : " + mentioned);
                                if (mentioned.length === 1) {
                                    let warnCount = await getCountWarning(mentioned[0], from);
                                    let num_split = mentioned[0].split("@s.whatsapp.net")[0];
                                    let warnMsg = `@${num_split}, Your warning status is (${warnCount}/3) in this group.`;
                                    conn.sendMessage(from, warnMsg, MessageType.extendedText, {
                                        contextInfo: { mentionedJid: mentioned },
                                    });
                                }
                            } else {
                                let taggedMessageUser = [
                                    mek.message.extendedTextMessage.contextInfo.participant,
                                ];
                                OwnerSend("Target : " + taggedMessageUser);
                                let warnCount = await getCountWarning(taggedMessageUser[0], from);
                                let num_split = taggedMessageUser[0].split("@s.whatsapp.net")[0];
                                let warnMsg = `@${num_split}, Your warning status is (${warnCount}/3) in this group.`;
                                conn.sendMessage(from, warnMsg, MessageType.extendedText, {
                                    contextInfo: { mentionedJid: taggedMessageUser },
                                });
                            }
                        } catch (error) {
                            OwnerSend(error);
                        }
                        break;

                    case 'warn':
                        if (!mek.message.extendedTextMessage) {
                            reply("❌ Tag someone!");
                            return;
                        }
                        try {
                            let mentioned =
                                mek.message.extendedTextMessage.contextInfo.mentionedJid;
                            if (mentioned) {
                                //when member are mentioned with command
                                OwnerSend("Target : " + mentioned);
                                if (mentioned == botNumber) return reply(`*Baka* How I can _Warn_ Myself.😂`);
                                if (allowedNumbs.includes(mentioned[0].split('@')[0])) return reply(`🙄 *Something Not Right* 🙄=> \nOh Trying to Warn Owner or Moderator 😊 *Baka*`);
                                if (allowedNumbs.includes(senderNumb) || isGroupAdmins) {
                                    if (mentioned.length === 1) {
                                        let warnCount = await getCountWarning(mentioned[0], from);
                                        let num_split = mentioned[0].split("@s.whatsapp.net")[0];
                                        let warnMsg = `@${num_split} 😒,You have been warned. Warning status (${warnCount + 1
                                            }/3). Don't repeat this type of behaviour again or you'll be banned 😔 from the group!`;
                                        conn.sendMessage(from, warnMsg, MessageType.extendedText, {
                                            contextInfo: { mentionedJid: mentioned },
                                        });
                                        await setCountWarning(mentioned[0], from);
                                        if (warnCount >= 2) {
                                            if (!isBotGroupAdmins) {
                                                reply("❌ I'm not Admin here!");
                                                return;
                                            }
                                            if (groupAdmins.includes(mentioned[0])) {
                                                reply("❌ Cannot remove admin!");
                                                return;
                                            }
                                            conn.groupRemove(from, mentioned);
                                            reply("✔ Number removed from group!");
                                        }
                                    } else {
                                        //if multiple members are tagged
                                        reply("❌ Mention only 1 member!");
                                    }
                                }
                                else {
                                    return reply(`❌ Admin Command`);
                                }
                            } else {
                                //when message is tagged with command
                                let taggedMessageUser = [
                                    mek.message.extendedTextMessage.contextInfo.participant,
                                ];
                                OwnerSend("Target : " + taggedMessageUser);
                                if (taggedMessageUser == botNumber) return reply(`*Baka* How I can _Warn_ Myself.😂`);
                                if (allowedNumbs.includes(taggedMessageUser[0].split('@')[0])) return reply(`🙄 *Something Not Right* 🙄=> \nOh Trying to Warn Owner or Moderator 😊 *Baka*`);
                                if (allowedNumbs.includes(senderNumb) || isGroupAdmins) {
                                    let warnCount = await getCountWarning(taggedMessageUser[0], from);
                                    let num_split = taggedMessageUser[0].split("@s.whatsapp.net")[0];
                                    await setCountWarning(taggedMessageUser[0], from);
                                    let warnMsg = `@${num_split} 😒,Your have been warned. Warning status (${warnCount + 1
                                        }/3). Don't repeat this type of behaviour again or you'll be banned 😔 from group!`;
                                    conn.sendMessage(from, warnMsg, MessageType.extendedText, {
                                        contextInfo: { mentionedJid: taggedMessageUser },
                                    });
                                    if (warnCount >= 2) {
                                        if (!isBotGroupAdmins) {
                                            reply("❌ I'm not Admin here!");
                                            return;
                                        }
                                        if (groupAdmins.includes(taggedMessageUser[0])) {
                                            reply("❌ Cannot remove admin!");
                                            return;
                                        }
                                        conn.groupRemove(from, taggedMessageUser);
                                        reply("✔ Number removed from group!");
                                    }
                                }
                                else {
                                    return reply("❌ Admin command!");
                                }
                            }
                        } catch (err) {
                            OwnerSend(err);
                            reply(`❌ Error!`);
                        }
                        break;

                    case 'unwarn':
                        if (!(allowedNumbs.includes(senderNumb))) {
                            reply("❌ Owner command!");
                            return;
                        }
                        if (!mek.message.extendedTextMessage) {
                            reply("❌ Tag someone!");
                            return;
                        }
                        try {
                            let mentioned =
                                mek.message.extendedTextMessage.contextInfo.mentionedJid;
                            if (mentioned) {
                                //when member are mentioned with command
                                if (mentioned.length === 1) {
                                    await removeWarnCount(mentioned[0], from);
                                    reply(`Set Warn Count to 0 for this user.`);
                                }
                                else {
                                    //if multiple members are tagged
                                    reply("❌ Mention only 1 member!");
                                }
                            } else {
                                //when message is tagged with command
                                let taggedMessageUser = [
                                    mek.message.extendedTextMessage.contextInfo.participant,
                                ];
                                await removeWarnCount(taggedMessageUser[0], from);
                                reply(`Set Warn Count to 0 for this user.`);
                            }
                        } catch (err) {
                            OwnerSend(err);
                            reply(`❌ Error!`);
                        }
                        break;

                    case 'block':
                        if (!mek.message.extendedTextMessage) {
                            reply("❌ Tag someone!");
                            return;
                        }
                        try {
                            let mentioned =
                                mek.message.extendedTextMessage.contextInfo.mentionedJid;
                            if (mentioned) {
                                //when member are mentioned with command
                                OwnerSend("Target : " + mentioned);
                                if (mentioned == botNumber) return reply(`*Baka* How I can _Block_ Myself.😂`);
                                if (allowedNumbs.includes(mentioned[0].split('@')[0])) return reply(`🙄 *Something Not Right* 🙄=> \nOh Trying to Block Owner or Moderator 😊 *Baka*`);
                                if (!(allowedNumbs.includes(senderNumb))) {
                                    reply("❌ Owner command!");
                                    return;
                                }
                                if (mentioned.length === 1) {
                                    let num_split = mentioned[0].split("@s.whatsapp.net")[0];
                                    await setBlockWarning(mentioned[0]);
                                    let warnMsg = `@${num_split} ,You have been Block To Use the Bot. Ask Owner or Mod to remove it.`;
                                    conn.sendMessage(from, warnMsg, MessageType.extendedText, {
                                        contextInfo: { mentionedJid: mentioned },
                                    });
                                    reply(`*👍Done Commands Blocked For The Number.*`);
                                } else {
                                    //if multiple members are tagged
                                    reply("❌ Mention only 1 member!");
                                }
                            } else {
                                //when message is tagged with command
                                let taggedMessageUser = [
                                    mek.message.extendedTextMessage.contextInfo.participant,
                                ];
                                OwnerSend("Target : " + taggedMessageUser);
                                if (taggedMessageUser == botNumber) return reply(`*Baka* How I can _Block_ Myself.😂`);
                                if (allowedNumbs.includes(taggedMessageUser[0].split('@')[0])) return reply(`🙄 *Something Not Right* 🙄=> \nOh Trying to Block Owner or Moderator 😊 *Baka*`);
                                if (!(allowedNumbs.includes(senderNumb))) {
                                    reply("❌ Owner command!");
                                    return;
                                }
                                let num_split = taggedMessageUser[0].split("@s.whatsapp.net")[0];
                                await setBlockWarning(taggedMessageUser[0]);
                                let warnMsg = `@${num_split} ,You have been Blocked To Use the Bot. Ask Owner or Mod to remove it.`;
                                conn.sendMessage(from, warnMsg, MessageType.extendedText, {
                                    contextInfo: { mentionedJid: taggedMessageUser },
                                });
                                reply(`*👍Done Commands Blocked For The Number.*`);
                            }
                        } catch (err) {
                            OwnerSend(err);
                            reply(`❌ Error!`);
                        }
                        break;

                    case 'unblock':
                        if (!(allowedNumbs.includes(senderNumb))) {
                            reply("❌ Owner command!");
                            return;
                        }
                        if (!mek.message.extendedTextMessage) {
                            reply("❌ Tag someone!");
                            return;
                        }
                        try {
                            let mentioned =
                                mek.message.extendedTextMessage.contextInfo.mentionedJid;
                            if (mentioned) {
                                //when member are mentioned with command
                                if (mentioned.length === 1) {
                                    await removeBlockWarning(mentioned[0]);
                                    reply(`*👍Done Commands Unblocked For The Number.*`);
                                } else {
                                    //if multiple members are tagged
                                    reply("❌ Mention only 1 member!");
                                }
                            } else {
                                //when message is tagged with command
                                let taggedMessageUser = [
                                    mek.message.extendedTextMessage.contextInfo.participant,
                                ];
                                await removeBlockWarning(taggedMessageUser[0]);
                                reply(`*👍Done Commands Unblocked For The Number.*`);
                            }
                        } catch (err) {
                            OwnerSend(err);
                            reply(`❌ Error!`);
                        }
                        break;

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
                        break;

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
                        break;

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
                        if (!mek.message.extendedTextMessage) {
                            reply("❌ Tag someone! or reply on message");
                            return;
                        }
                        if (!isGroupAdmins || !allowedNumbs.includes(senderNumb)) {
                            reply("Saale khud ko admin samjhta hai kya?😂");
                            return;
                        }
                        if (!isBotGroupAdmins) return reply(errors.admin_error);
                        try {
                            let mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid;
                            if (mentioned) {
                                if (mentioned == botNumber) return reply(`*Baka* How I can _Kick_ Myself.😂`);
                                if (allowedNumbs.includes(mentioned[0].split('@')[0])) return reply(`🙄 *Something Not Right* 🙄\nOh Trying to Kick Owner or Moderator 😊 *Baka*`);
                                OwnerSend("Target : " + mentioned);
                                if (mentioned.length > 1) {
                                    return reply(`Tag Only One Person`);
                                } else {
                                    conn.groupRemove(from, mentioned)
                                    reply(`✔️ *Removed*`)
                                }
                            } else {
                                let taggedMessageUser = [
                                    mek.message.extendedTextMessage.contextInfo.participant,
                                ];
                                if (taggedMessageUser == botNumber) return reply(`*Baka* How I can _Kick_ Myself.😂`);
                                if (allowedNumbs.includes(taggedMessageUser[0].split('@')[0])) return reply(`🙄 *Something Not Right* 🙄\nOh Trying to Kick Owner or Moderator 😊 *Baka*`);
                                OwnerSend("Target : " + taggedMessageUser);
                                conn.groupRemove(from, taggedMessageUser)
                                reply(`✔️ *Removed*`)
                            }
                        } catch (err) {
                            OwnerSend("error" + err);
                            reply(`Error`);
                        }
                        break;

                    case 'promote':
                        if (!isGroup) return;
                        if (!mek.message.extendedTextMessage) {
                            reply("❌ Tag someone! or reply on message");
                            return;
                        }
                        if (!isGroupAdmins || !allowedNumbs.includes(senderNumb)) {
                            reply("Saale khud ko admin samjhta hai kya?😂");
                            return;
                        }
                        if (!isBotGroupAdmins) return reply(errors.admin_error);
                        try {
                            let mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid;
                            if (mentioned) {
                                if (mentioned == botNumber) return reply(`*Baka* Don't Tag Me.😂`);
                                OwnerSend("Target : " + mentioned);
                                if (mentioned.length > 1) {
                                    return reply(`Tag Only One Person`);
                                } else {
                                    conn.groupMakeAdmin(from, mentioned)
                                    reply(`✔️ *Promoted*`)
                                }
                            } else {
                                let taggedMessageUser = [
                                    mek.message.extendedTextMessage.contextInfo.participant,
                                ];
                                if (taggedMessageUser == botNumber) return reply(`*Baka* Don't Tag Me.😂`);
                                if (allowedNumbs.includes(taggedMessageUser[0].split('@')[0])) return reply(`🙄 *Something Not Right* 🙄\nWhying Tagging Owner 😊 *Baka*`);
                                OwnerSend("Target : " + taggedMessageUser);
                                conn.groupMakeAdmin(from, taggedMessageUser)
                                reply(`✔️ *Promoted*`)
                            }
                        } catch (err) {
                            OwnerSend("error" + err);
                            reply(`Error`)
                        }
                        break;

                    case 'demote':
                        if (!isGroup) return;
                        if (!mek.message.extendedTextMessage) {
                            reply("❌ Tag someone! or reply on message");
                            return;
                        }
                        if (!isGroupAdmins || !allowedNumbs.includes(senderNumb)) {
                            reply("Saale khud ko admin samjhta hai kya?😂");
                            return;
                        }
                        if (!isBotGroupAdmins) return reply(errors.admin_error);
                        try {
                            let mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid;
                            if (mentioned) {
                                if (mentioned == botNumber) return reply(`*Baka* How I can _Demote_ Myself.😂`);
                                if (allowedNumbs.includes(mentioned[0].split('@')[0])) return reply(`🙄 *Something Not Right* 🙄\nOh Trying to Demote Owner or Moderator 😊 *Baka*`);
                                OwnerSend("Target : " + mentioned);
                                if (groupAdmins.includes(mentioned[0]) == false) return reply(`User Not Found`);
                                if (mentioned.length > 1) {
                                    return reply(`Tag Only One Person`);
                                } else {
                                    conn.groupDemoteAdmin(from, mentioned)
                                    reply(`✔️ *Demoted*`)
                                }
                            } else {
                                let taggedMessageUser = [
                                    mek.message.extendedTextMessage.contextInfo.participant,
                                ];
                                if (taggedMessageUser == botNumber) return reply(`*Baka* How I can _Demote_ Myself.😂`);
                                if (allowedNumbs.includes(taggedMessageUser[0].split('@')[0])) return reply(`🙄 *Something Not Right* 🙄\nOh Trying to Demote Owner or Moderator 😊 *Baka*`);
                                OwnerSend("Target : " + taggedMessageUser);
                                if (groupAdmins.includes(taggedMessageUser[0]) == false) return reply(`User Not Found`);
                                conn.groupDemoteAdmin(from, taggedMessageUser)
                                reply(`✔️ *Demoted*`)
                            }
                        } catch (err) {
                            OwnerSend("error" + err);
                            reply(`Error`)
                        }
                        break;

                    case 'chat':
                        if (!isGroup) return;
                        if (!isGroupAdmins || !allowedNumbs.includes(senderNumb)) {
                            reply("Saale khud ko admin samjhta hai kya?😂");
                            return;
                        }
                        if (!isBotGroupAdmins) return reply(errors.admin_error);
                        if (args.length < 1) return;
                        if (args[0] == 'off') {
                            conn.groupSettingChange(from, GroupSettingChange.messageSend, true);
                            reply(`✔️ *Only Admin can send Message*`);
                        } else if (args[0] == 'on') {
                            conn.groupSettingChange(from, GroupSettingChange.messageSend, false);
                            reply(`✔️ *Allowed all member can send Message*`);
                        } else {
                            return;
                        }
                        break;

                    case 'rename':
                        if (!isGroup) return;
                        if (!isGroupAdmins || !allowedNumbs.includes(senderNumb)) {
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
                        if (!isGroupAdmins || !allowedNumbs.includes(senderNumb)) {
                            reply("Saale khud ko admin samjhta hai kya?😂");
                            return;
                        }
                        reply(`_Bye_\n*Mera Time Aa gya*`);
                        conn.groupLeave(from)
                        break;

                    default:
                        if (isGroup || !allowedNumbs.includes(senderNumb))
                            reply(`*Baka*,There is no Command like this.\nUse *-help* to get my command list :)`)
                        break;
                }
            }
        } catch (e) {
            console.log('Error : %s', e)
        }
    })
}
main()
