const vws = require('./cheerio') // cheerio.js provides doItAgain()

module.exports = app => {
    app.post('/scraper', (req, res) => {
        // Fetches Text HTML based on passed URL, then passes the results to cheerio.js

        console.log('POST Request Received')
        res.status(200).send()
        const fetch = require('node-fetch');
        const rURL = req.body

        fetch(rURL.recipeURL)
        .then((response) => response.text())
        .then((data) => { console.log(vws.doItAgain(data, rURL.recipeURL)) })
        .catch((err) => { console.log(err) });
    })
}