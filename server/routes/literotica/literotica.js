
const express = require('express');
const router = express.Router();
const axios = require('axios');


router.get("/c/:id", (req, res) => {
    var data = getStories(req.params.id).then(r => {
        res.send({ "data": r })
    })
})

router.get("/s/:title", async (req, res) => {
    var author = req.query.author;
    var title = req.params.title;
    var parts = await getStoryParts(title, author);
    var chapters = await Promise.all(parts.map(x => getChapterParts(x)));

    var pageData = await Promise.all(chapters.map(async chapter =>
        await Promise.all(chapter.map(async page =>
            await getPage(page)))));

    res.send({ data: pageData });

})
router.get("/", (req, res) => {
    getCagetories().then(r => res.send({ "data": r }));
})

async function getStories(category) {
    var baseLink = `https://www.literotica.com/c/${category}/1-page`
    var data = await axios.get(baseLink);
    var selectRX = /(?<=option value=")\d+/gm;
    var selectMatches = data.data.match(selectRX)
    var pages = selectMatches[selectMatches.length - 1];

    var rt = {};
    var storyRX = /(?<=https:\/\/www.literotica.com\/s\/).+?(?=")/gm;
    data.data.match(storyRX).map(x => {
        var prelimAuthorRX = new RegExp("(?<=" + x + ").{0,800}submissions", "gms");
        var prelimAuthor = data.data.match(prelimAuthorRX)[0];
        var authorRX = /literotica.+?(?=&)/gm
        var author = "https://www." + prelimAuthor.match(authorRX)[0];
        var filterRX = /^.{4,}?(?=-ch|-\d|-pt)/gm;
        var story = x.match(filterRX)
        if (story) {
            rt[story] = author;
        }
        else {
            rt[x] = author;
        }
    })
    return rt;
}

async function getStoryParts(title, author) {
    var data = await axios.get(author + "&page=submissions");
    var storyRX = new RegExp("https:\/\/www.literotica.com/s/" + title + ".{0,}?(?=\")", "gms");
    var story = data.data.match(storyRX);
    return story;
}

async function getChapterParts(chapter = "https://www.literotica.com/s/zachs-nieces-ch-07-mall-girl") {
    var data = await axios.get(chapter);
    var pageRX = /\d+(?=\sPages:)/gms
    var pageNumber = parseInt(data.data.match(pageRX)[0]);
    var pages = [];
    for (var i = 1; i < pageNumber + 1; i++) {
        pages.push(chapter + "?page=" + i)
    }
    return pages;
}

async function getPage(page = "https://www.literotica.com/s/zachs-nieces-ch-07-mall-girl?page=2") {
    var data = await axios.get(page);
    var textRX = /(?<=x-r15\"><div><p>).+?(?=<\/p><\/div>)/gms
    var text = data.data.match(textRX)[0];
    text = text.replace(/<br  \/>/gm, "");
    return text;
}

async function getCagetories() {
    var rt = []
    var data = await axios.get('https://www.literotica.com/stories/');;
    var categoryRX = /https:\/\/www.literotica.com\/c\/.+?(?=")/gm
    data.data.match(categoryRX).map(x => {
        var categoryName = x.match(/(?<=\/c\/).+/)[0];
        var readableCategoryName = categoryName.replace(/-/g, " ");
        rt.push({ "name": readableCategoryName, "rawName": categoryName, "link": x })
    })
    return rt;
}
module.exports = router;