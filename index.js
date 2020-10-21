const express = require('express');
const tools = require('./tools');
const app = express();
const config = require("./config.json");
const fs = require("fs");

app.set('view engine', 'ejs');
app.engine("html", require("ejs").renderFile);
app.use('/static', express.static('./views'));

global.skippedID = [];

//czynności i interwały przy odpalaniu apki
tools.probeRefreshMZGOV();
setInterval(tools.probeRefreshMZGOV, 1000 * 60 * 3); //co 3 minuty pobiera info z twittera MZ
tools.retrieveNewVideos();
setInterval(tools.retrieveNewVideos, 1000 * 60 * 60 * 6); //co 6 godzin wystarczy z yt
//endpointy strony
app.get('/', async (req, res) => {
    res.render("index.ejs");
});
app.get('/timer', async (req, res) => {
    res.render("timer.ejs");
});
app.get('/videos', async (req, res) => {
    res.render("videos.ejs", {
        videos: await tools.readAllChannels()
    });
});

app.get('/corona', async (req, res) => {
    const stats = JSON.parse(await fs.readFileSync("./data/corona.json"));
    res.render("corona.ejs", {
        twitter: stats.finalContent,
        size: stats.size,
        time: stats.time,
        twitterID: stats.id,
        lastTime: stats.lastTime
    });
});

app.listen(config.port, () => {
    console.log(`App running on localhost:${config.port}`);
});