const config = require("./config.json");
const Twitter = require('twitter');
const moment = require("moment");
const client = new Twitter({        //definiujemy klienta Twittera, pobieranie info z MZ
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    bearer_token: config.bearer_token
});
module.exports = {
    refreshMZGOV: function () {
        const params = {screen_name: 'MZ_GOV_PL', count: 10, tweet_mode: "extended"}; //nie można na żywo pobierać danych z Twitterka, więc pobieramy co jakiś czas 10 ostatnich
        client.get('statuses/user_timeline', params, function (error, tweets) {
            if (!error) {
                let next = false;
                tweets.reverse();
                tweets.forEach(t => {
                    if (t.full_text.includes("Mamy ") && !skippedID.includes(t.id)) {
                        status.push(t.full_text);
                        statusTime = moment(t.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY').locale("pl").format('D MMMM YYYY, HH:mm');
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
    }
};