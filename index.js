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
tools.refreshMZGOV();
setInterval(tools.refreshMZGOV, 1000 * 60 * 30); //co 30 minut pobiera info z twittera MZ

//endpointy strony
app.get('/', async (req, res) => {
    res.render("index.ejs");
});
app.get('/test', async (req, res) => {
    res.render("test.ejs");
});

app.get('/corona', async (req, res) => {
    const stats = JSON.parse(await fs.readFileSync("./data/corona.json"))
    res.render("corona.ejs", {
        twitter: stats.finalContent,
        size: stats.size,
        time: stats.time
    });
});

app.listen(config.port, () => {
    console.log(`App running on localhost:${config.port}`);
});