const express = require('express');
const config = require("./config.json");
const app = express();
let status = [];
let skippedID = [];
const Twitter = require('twitter');


const client = new Twitter({
    consumer_key: 'OqDE29qM2plVw27v69DA5RRIE',
    consumer_secret: 'F8u87yfTPoSUCHEcAg3D75i1gIGrS069DTNnwsaCGvlgOAbHGP',
    bearer_token: 'AAAAAAAAAAAAAAAAAAAAAD5nIgEAAAAAVPTl3%2FUCFXYgiF4pxipWRJO%2B8Bw%3D7BhogyMn5PWUwWUhyZwYvhblXy22f0hQMPKlwssILOE9nQD8aX'
});


app.get('/', async (req, res) => {
    res.send(status);
    const params = {screen_name: 'MZ_GOV_PL', count: 10, tweet_mode: "extended"};
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            let next = false;
            tweets.reverse()
            tweets.forEach(t => {
                if (t.full_text.includes("Mamy ") && !skippedID.includes(t.id)) {
                    status.push(t.full_text);
                    skippedID.push(t.id);
                    return next = true;
                }
                if (next) {
                    status.push(t.full_text);
                    skippedID.push(t.id);
                    if (t.full_text.includes("Liczba zakażonych koronawirusem:")) next = false;
                }
            });
        }
    });
});

app.listen(config.port, () => {
    console.log(`App running on localhost:${config.port}`);
});