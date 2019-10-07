
const express = require('express');
const router = express.Router();
const fs = require('fs');


router.get("/", (req, res) => {
    var data = fs.readFileSync("D:\\World of Warcraft\\_classic_\\WTF\\Account\\108778585#1\\SavedVariables\\XP.lua", 'utf-8')
    var lineRX = /\".+?\]/gm

    var rt = [];
    var cur = [];
    var ind = -1;
    var last = null;
    var colors = ["#FF00FF", "#00FF00"]

    data.match(lineRX).map(line => {
        var a = line.split(",");
        var character = a[0];
        var currentXP = a[1];
        var maxXP = a[2];
        var level = a[3];
        var timeStamp = a[4];
        var playedLevel = a[5];
        var playedTotal = a[6];
        var area = a[7].slice(0, -1);
        // if (area != last) {
        //     if (!!last) {
        //         rt.push({ area: last, plots: cur, color: colors[ind % 2] });
        //         cur = []
        //     }
        //     last = area;
        //     ind += 1;
        // }
        // cur.push({ plot: { x: playedTotal / (3600 * 24), y: parseInt((currentXP / maxXP) * 100) }, level: level })
        cur.push({ x: playedTotal / (3600 * 24), y: parseInt((currentXP / maxXP) * 100) })
    })


    res.send(JSON.stringify({ "data": cur }));


})
module.exports = router;