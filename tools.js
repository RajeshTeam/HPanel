const config = require("./config.json");
const fs = require("fs");
const Twitter = require('twitter');
const moment = require("moment");
const fetch = require("node-fetch");
const parseXML = require("fast-xml-parser");
const client = new Twitter({        //definiujemy klienta Twittera, pobieranie info z MZ
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    bearer_token: config.bearer_token
});
const channels = require("./data/channels.json");

module.exports = {
    refreshMZGOV: function () {
        try {
            let stats = {};
            const params = {screen_name: 'MZ_GOV_PL', count: 20, tweet_mode: "extended"}; //nie można na żywo pobierać danych z Twitterka, więc pobieramy co jakiś czas 10 ostatnich
            client.get('statuses/user_timeline', params, function (error, tweets) {
                if (!error) {
                    let next = false;
                    tweets.reverse();
                    tweets.forEach(t => {
                        if (t.full_text.includes("Mamy ") && !skippedID.includes(t.id)) {
                            stats.content = [];
                            stats.content.push(t.full_text);
                            stats.id = t.id_str;
                            stats.time = moment(t.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY').locale("pl").format('D MMMM YYYY, HH:mm');
                            stats.lastTime = moment().locale("pl").format('D MMMM YYYY, HH:mm');
                            skippedID.push(t.id);
                            return next = true;
                        }
                        if (next) {
                            stats.content.push(t.full_text);
                            skippedID.push(t.id);
                            if (t.full_text.includes("Liczba zakażonych koronawirusem:")) //koniec zbierania twitów
                            {
                                next = false;
                                stats.size = stats.content[0]?.match(new RegExp("Mamy " + "(.*)" + " now"))?.[1].replace(/ /g, '');
                                stats.finalContent = stats.content?.join(' ').replace(/\n/g, ' ');
                                fs.writeFileSync("./data/corona.json", JSON.stringify(stats));
                            }
                        }
                    });
                } else console.log(error);
            });
        } catch (e) {
            console.log(e);
        }
    },
    probeRefreshMZGOV: function () {
        try {
            const params = {screen_name: 'MZ_GOV_PL', count: 1, tweet_mode: "extended"}; //jeżeli ostatni twitter jest nowy, to odświeżamy całość
            client.get('statuses/user_timeline', params, async function (error, tweets) {
                if (!error) {
                    const stats = JSON.parse(await fs.readFileSync("./data/corona.json"));
                    stats.lastTime = moment().locale("pl").format('D MMMM YYYY, HH:mm');
                    await fs.writeFileSync("./data/corona.json", JSON.stringify(stats));
                    if (!skippedID.includes(tweets[0].id)) require("./tools").refreshMZGOV();
                }
            });

        } catch (e) {
            console.log(e);
        }
    },
    retrieveNewVideos: async function () {
        try {
            const ids = channels.IDs;
            for (const id of ids) {
                //obręb kanału
                let data = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${id}`);
                if (data.status !== 200) return;
                data = await data.text();
                const parsed = await parseXML.parse(data.toString('utf8'), {}, true);
                let videos = [];
                parsed.feed.entry.forEach(video => {
                    //obręb filmu
                    videos.push({id: video["yt:videoId"], title: video.title}); //urle: "https://www.youtube.com/watch?v=
                });
                const obj = {
                    id,
                    name: parsed.feed.title,
                    videos
                };
                fs.writeFileSync(`./data/${id}.json`, JSON.stringify(obj));
            }
        } catch (e) {
            console.log(e);
        }
    },
    readAllChannels: async function () {
        const channels = require("./data/channels.json");
        let newChannels = [];
        for (const id of channels.IDs) {
            newChannels.push(JSON.parse(await fs.readFileSync(`./data/${id}.json`)));
        }
        return newChannels;
    }
};