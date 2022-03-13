const axios = require("axios");

module.exports.getInstaVideo = async (url) => {
  let imgDirectLink = "",
    videoDirectLink = "";
  try {
    if (url.includes("?")) url = url.slice(0, url.search("\\?"));
    const res = await axios.get(
      `https://api.neoxr.eu.org/api/ig?url=${url}&apikey=yourkey`
    );

    if (res.data.data[0].type === "mp4") {
      videoDirectLink = res.data.data[0].url;
    } else if (res.data.data[0].type === "jpg") {
      imgDirectLink = res.data.data[0].url;
    }
  } catch (err) {
    console.log(err);
  }
  return { imgDirectLink, videoDirectLink };
};