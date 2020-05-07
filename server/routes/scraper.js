// Add comments.
const vws = require('./cheerio')

module.exports = app => {
    app.post('/scraper', (req, res) => {
        // Make the URL dynamic now!

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