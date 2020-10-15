const express = require('express');
const tools = require('./tools');
const app = express();
const config = require("./config.json");


app.set('view engine', 'ejs');
app.engine("html", require("ejs").renderFile);
app.use('/static', express.static('./views'));


global.status = [];
global.statusTime = "";
global.skippedID = [];

//czynności i interwały przy odpalaniu apki
tools.refreshMZGOV();
setInterval(tools.refreshMZGOV, 1000); //co 30 minut pobiera info z twittera MZ
//1000 * 60 * 30

//endpointy strony
app.get('/', async (req, res) => {
    res.render("index.ejs");
});
app.get('/test', async (req, res) => {
    res.render("test.ejs");
});

app.get('/corona', async (req, res) => {
    res.render("corona.ejs", {
        twitter: status?.join(' ').replace(/\n/g, ' '),
        size: status[0]?.match(new RegExp("Mamy " + "(.*)" + " nowych"))[1],
        statusTime
    });
});

app.listen(config.port, () => {
    console.log(`App running on localhost:${config.port}`);
});