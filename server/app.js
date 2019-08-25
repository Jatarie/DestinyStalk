"use strict";
const express = require('express')
const app = express();
const axios = require('axios');
const fs = require('fs');
const email = require('./mail');
const notifier = require('node-notifier');

var months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

app.get('/api', async (req, res) => {
    var data = fs.readFileSync('data.json');
    data = JSON.parse(data);
    res.send(data.data);
});

app.get('/api/OR', async (req, res) => {
    var timeStamp = req.query.timeStamp;
    var date = new Date(parseInt(timeStamp) * 1000);
    var fullYear = date.getUTCFullYear();
    var month = date.getUTCMonth();
    var day = pad(date.getUTCDate());
    var hour = pad(date.getUTCHours());
    var minute = pad(date.getUTCMinutes());
    var second = pad(date.getUTCSeconds());
    month = pad(month + 1);
    var x = `\\[${fullYear}\\-${month}\\-${day} ${hour}:${minute}:${second} UTC\\] Destiny:`;
    var url = `OverRustle_${fullYear}-${month}-${day}.txt`
    var data = fs.readFileSync(url, 'utf-8');
    var lines = data.match(/^.+?$/gm);

    var q = new queue(50);

    for (var i = 0; i < lines.length; i++) {
        q.push(lines[i]);
        if (q.found) {
            q.counter -= 1;
        }
        if (lines[i].match(x)) {
            q.found = true;
        }
        if (q.counter == 0) {
            break;
        }
    }

    var rt = [];
    q.data.map(x => function (x) {
        rt.push(x.match(/(?<=\[.+?\]).+/gm))
    }(x))

    res.send({ "data": rt });
});

function queue(size) {
    this.data = [];
    this.size = size;
    this.found = false;
    this.counter = parseInt(size / 2);
    this.push = (x) => {
        if (this.data.push(x) > this.size) {
            this.data.shift();
        }
    }
}

function pad(a) {
    if (a.toString().length === 1) {
        a = "0" + a;
    }
    return a;
}


async function Twitch() {
    var rt = [];
    var client_id = "zt9lg004v1ztyfsd4agt2418nfbzuv";
    var params = {};
    var vod_id_list_url = `https://api.twitch.tv/helix/videos?user_id=18074328`
    await axios.get(vod_id_list_url, { headers: { "Client-ID": client_id } })
        .then(r => r.data.data
            .map(x => rt.push({ "type": "Twitch", "date": new Date(x.created_at).getTime() / 1000, "text": x.title, "link": x.url })));
    return rt;
};

async function Twitter() {
    var rt = [];
    var client_id = "N/A";
    var headers = { 'Authorization': "Bearer AAAAAAAAAAAAAAAAAAAAAJXQ%2FQAAAAAAtxOHWEpJOtVqY63xCodl8mWZ9lo%3DtvlsAtIRZ70s0KgWkKq4HkMgfWRyoPyLazTclSS7YYGrmRd8F5" }
    var url = "https://api.twitter.com/1.1/search/tweets.json?q=from%3Amodalsevenths&tweet_mode=extended&count=100";
    var data = await axios.get(url, { headers: headers })
    data.data.statuses.map(x => rt.push({ "type": "Twitter", "date": new Date(x.created_at).getTime() / 1000, "text": x.full_text, "link": "https://twitter.com/modalsevenths/statuses/" + x.id_str }));
    return rt;
};

async function Reddit() {
    var rt = [];
    var url = "https://api.reddit.com/user/neodestiny/comments?limit=100";
    var data = await axios.get(url);
    data.data.data.children.map(x => rt.push({ "type": "Reddit", "date": x.data.created_utc, "text": x.data.body, "link": "https://reddit.com" + x.data.permalink }))
    return rt;
};

async function UpdateDatabase() {
    var dataTwitter = Twitter();
    var dataReddit = Reddit();
    var dataOR = OverRustle();
    var dataTwitch = Twitch()

    dataTwitter = await dataTwitter;
    dataReddit = await dataReddit;
    dataOR = await dataOR;
    dataTwitch = await dataTwitch;

    var data = Combine([dataTwitter, dataReddit, dataOR, dataTwitch]);

    data.sort((a, b) => b.date - a.date);
    data = { "data": data };

    var dataBase = JSON.parse(fs.readFileSync("data.json"));
    var mostRecent = dataBase.data.data[0];
    var current = data.data[0];

    if (current.text != mostRecent.text) {
        notifier.notify('Message');
        notifier.notify({
            title: 'My notification',
            message: 'Hello, there!'
        });
    }

    fs.writeFile("data.json", JSON.stringify({ "data": data }), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Database updated at " + new Date());
    });
};

function Combine(a) {
    var rt = [];
    a.map(b => b.map(c => rt.push(c)));
    return rt
};


async function OverRustle() {
    var rt = [];
    var today = new Date();
    var date = new Date();
    for (var i = 0; i < 3; i++) {
        date.setDate(today.getUTCDate() - i);
        var month = date.getUTCMonth();
        var MONTH_WORD = months[month];
        var YEAR = date.getUTCFullYear();
        var MONTH_NUMBER = pad(date.getUTCMonth() + 1);
        var DAY = pad(date.getUTCDate());
        var fileName = `OverRustle_${YEAR}-${MONTH_NUMBER}-${DAY}.txt`;

        if (!fs.existsSync(fileName) || DAY == new Date().getUTCDate()) {
            var url = `https://overrustlelogs.net/Destinygg%20chatlog/${MONTH_WORD}%20${YEAR}/${YEAR}-${MONTH_NUMBER}-${DAY}.txt`;
            var data = await axios.get(url);
            fs.writeFileSync(`OverRustle_${YEAR}-${MONTH_NUMBER}-${DAY}.txt`, data.data);
        }

        var data = fs.readFileSync(fileName, 'utf-8');
        var x = /^\[.{23}\]\sDestiny:.+?\n/gm
        data.match(x).map(x => rt.push(parseOverrustle(x)));

    }
    return rt
};

function parseOverrustle(data) {
    var timeRX = /\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\sUTC/gm
    var time = data.match(timeRX)[0];
    var datetime = new Date(time);
    var textRX = /(?<=Destiny:\s).+?\n/gm
    var text = data.match(textRX)[0];
    var rt = { "type": "OverRustle", "date": datetime.getTime() / 1000, "text": text, "link": null };
    return rt;
};

app.get("/graphapi", (req, res) => {
    var data = fs.readFileSync("E:\\World of Warcraft\\_retail_\\WTF\\Account\\108778585#1\\SavedVariables\\XP.lua", 'utf-8')
    var lineRX = /\".+?\]/gm

    var rt = { plots: [] };

    data.match(lineRX).map(line => {
        var a = line.split(",");
        var character = a[0];
        var currentXP = a[1];
        var maxXP = a[2];
        var level = a[3];
        var timeStamp = a[4];
        var playedLevel = a[5];
        var playedTotal = a[6];
        var area = a[7];
        rt.plots.push({ x: playedTotal, y: parseInt((currentXP / maxXP) * 100) })
    })

    console.log("Graph");

    res.send(JSON.stringify({ "data": rt }));


})

app.listen(8000, () => {
    console.log('Example app listening on port 8000!')

    UpdateDatabase();
    setInterval(() => {
        UpdateDatabase();
    }, 60000 * 5);
});
