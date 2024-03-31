const cds = require("@sap/cds");
const ytdl = require('ytdl-core');
const { formatTime } = require("../srv/util/util");
const fs = require("fs");
const path = require('path');

module.exports = cds.service.impl(async function (srv) {
    srv.on("getVideoInfo", async (req) => {
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

    srv.on("downloadVid", async (req) => {
        const { url, title } = req.data;

        let video;
        try {
            //returns a readable stream
            video = ytdl(url);
        } catch (error) {
            req.reject(400, error.message)
        }

        //constructing the file path to save the video file temporarily
        const relativePath = 'video_files';
        //__dirname provides the current directory
        const filePath = path.join(__dirname, relativePath, `${title}.mp4`);
        const writeStream = fs.createWriteStream(filePath);

        //piping data --> converting the stream to a file.
        video.pipe(writeStream);

        writeStream.on('finish', () => {
            return 'Video downloaded and saved successfully.';
        });

        // Handle errors
        writeStream.on('error', (error) => {
            req.reject(400, error.message);
        });

        return 'Video downloaded and saved successfully.';
    })
})