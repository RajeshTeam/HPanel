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
const colors = {
    6: "#000000", //??
    5: "#d11204", //bardzo zły??
    4: "#d14c04", //zły
    3: "#f7e700", //umiarkowany
    2: "#bcd104", //dobry
    1: "#3bd104", //bardzo dobry
    0: "#008000"  //??
};
// z tymi kolorami to ja strzelam że jest zakres 0-6 bo po co komu docsy...
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
                    let file;
                    try {
                        file = await fs.readFileSync("./data/corona.json");
                    } catch (e) {
                        file = "{}";
                    }
                    const stats = JSON.parse(file || "{}");
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
                    const desc = video["media:group"]["media:description"].replaceAll("\n", " ").replaceAll("&#13", " ").slice(0, 200) + " (...)";
                    videos.push({id: video["yt:videoId"], title: video.title, desc});
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
        try {
            const channels = require("./data/channels.json");
            let newChannels = [];
            for (const id of channels.IDs) {
                newChannels.push(JSON.parse(await fs.readFileSync(`./data/${id}.json`)));
            }
            return newChannels;
        } catch (e) {
            console.log(e);
        }
    },
    getAllAirData: async function () {
        try {
            let data = await fetch(`https://api.gios.gov.pl/pjp-api/rest/station/findAll`);
            if (data.status !== 200) return;
            data = await data.json();
            airdata = data;
        } catch (e) {
            console.log(e);
        }
    },
    calculateNearestAndGetData: async function (lat = "52.1356", lon = "21.0030") { //Warszawa domyślnie
        try {
            let distances = [];
            airdata.forEach(data => {
                distances.push({
                    distance: this.calculateDistance({
                        lat1: lat,
                        lon1: lon,
                        lat2: data.gegrLat,
                        lon2: data.gegrLon,
                        stationID: data.id
                    }), id: data.id
                });
            });
            const calculated = distances.sort(function (a, b) {
                return a.distance - b.distance;
            });
            const nearestID = calculated[0].id;
            let data = await fetch(`https://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/${nearestID}`);
            if (data.status !== 200) return;
            data = await data.json();
            return {
                overall: data.stIndexLevel?.indexLevelName,
                overallCol: colors[data.stIndexLevel?.id.toString()],
                so2: data.so2IndexLevel?.indexLevelName,
                no2: data.no2IndexLevel?.indexLevelName,
                co: data.coIndexLevel?.indexLevelName,
                pm10: data.pm10IndexLevel?.indexLevelName,
                o3: data.o3IndexLevel?.indexLevelName,
                station: airdata.find(x => x.id === data.id).stationName,
            };
        } catch (e) {
            console.log(e);
        }
    },
    calculateDistance: function ({lat1 = "52.1356", lon1 = "21.0030", lat2, lon2, unit = "K"}) { //Warszawa domyślnie
        const radlat1 = Math.PI * lat1 / 180;
        const radlat2 = Math.PI * lat2 / 180;
        const theta = lon1 - lon2;
        const radtheta = Math.PI * theta / 180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit === "K") {
            dist = dist * 1.609344;
        }
        if (unit === "N") {
            dist = dist * 0.8684;
        }
        return dist;
    }
};