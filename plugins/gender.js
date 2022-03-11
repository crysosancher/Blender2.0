const axios = require('axios');
module.exports.getGender = async (name) => {
    let url = "https://api.genderize.io/?name=" + name;
    let { data } = await axios.get(url);
    let genderText = `${data.name} is ${data.gender} with ${data.probability} probability`;
    return new Promise((resolve, reject) => {
        if (genderText != '')
            resolve(genderText);
        else
            reject("Name Not Found!!!");
    });
};