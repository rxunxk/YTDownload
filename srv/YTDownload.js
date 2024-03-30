const cds = require("@sap/cds");
const ytdl = require('ytdl-core');
const { formatTime } = require("../srv/util/util");

module.exports = cds.service.impl(async function (srv) {
    srv.on("download", async (req) => {
        const { url } = req.data;

        const response = {
            thumbnail: '',
            length: 0,
            title: ''
        };

        let info;
        try {
            info = await ytdl.getBasicInfo(url);
        } catch (error) {
            req.reject(404, error.message);
        }

        response.thumbnail = info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url;
        response.length = formatTime(info.videoDetails.lengthSeconds);
        response.title = info.videoDetails.title;

        return response;
    })
})