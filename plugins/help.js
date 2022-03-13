const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

module.exports.userHelp = (prefix, groupName) => {
    return `
    ─「 *${groupName} User Commands* 」─
  ${readMore}

*${prefix}alive*
    _Know if Bot is Online or not_
    _Alias ${prefix}a_

*${prefix}blend*
    _For GUI interface_

*${prefix}list*
    _For Automated Commands_

*${prefix}admin*
    _For Admin Commands List_

*${prefix}stock*
    _For Stock Commands List_

*${prefix}song*
    _For Downloading songs by name_
        Eg:${prefix}song tum hi ho

*${prefix}delete*
    _delete message send by bot_
    _Alias ${prefix} d, ${prefix} delete_

*${prefix}link*
    _Get group invite link!_
    _Alias with ${prefix}getlink, ${prefix}grouplink_

*${prefix}joke*
    _Get a Random joke_
    _${prefix}joke categories_
    _Categories: Programming, Misc, Pun, Spooky, Christmas, Dark_

*${prefix}movie _Name_*
    _Get Download link for movie_
    _Eg: ${prefix}movie Avengers_

*${prefix}anime*
    _Get a Quote said by Anime Character_
    *Example:*
        _${prefix}anime_
        _${prefix}anime char saitama_
        _${prefix}anime title one punch man_
        
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

*${prefix}toimg*
    _For converting sticker to image_
    _Alias ${prefix}image_

*${prefix}fact*
    _Get a random Fact_

*${prefix}news*
    _Show Tech News_
    _or ${prefix}news < any category >_
    _Use ${prefix}list for whole valid list_
    _category could be sports, business or anything_

*${prefix}score*
    _fetch live ipl scores_
    eg:${prefix} score

*${prefix}idp*
    _download Instagram private profile picture_
    eg:${prefix}idp username

*${prefix}insta*
    _download Instagram media_
    eg:${prefix}insta linkadress

*${prefix}gender FirstName*
    _get gender % from name_

*${prefix}yt*
    _download youTube video in best quality_
    eg:${prefix}yt linkadress

*${prefix}yta*
    _download youtube audio_
    eg:${prefix}yta linkadress

*${prefix}horo*
    _show horoscope_
    eg:${prefix}horo pisces

*${prefix}tts*
    _Changes Text to Sticker_
    eg:${prefix}tts we Love Dev

*${prefix}ud*
    _Show Meaning of your name_
    eg:${prefix}ud ram

*${prefix}dic*
    _A classic Dictionary_
    eg:${prefix}ud ram

*${prefix}source*
    _Get the source code!_
  Made with love, use with love ♥️`
}

module.exports.StockList = (prefix, groupName) => {
    return `
    ─「 *${groupName} User Stocks Commands* 」─
${readMore}

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
    with advice`
}

module.exports.adminList = (prefix, groupName) => {
    return `
    ─「 *${groupName} Admin Commands* 」─
${readMore}

*${prefix}add <phone number>*
    _Add any new member!_

*${prefix}ban <@mention>*
    _Kick any member out from group!_
    _Alias with ${prefix}remove, ${prefix}kick_

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

*${prefix}removebot*
    _Remove bot from group!_
  
*${prefix}warn <@mention>*
    _Give Waring to a person_
    _Bot Will kick if person got 3 warning_

*${prefix}tagall*
    _For attendance alert_
    _Eg: ${prefix}tagall message!_`
}
