// Add comments.
vws = require('./cheerio')

module.exports = app => {
    app.post('/scraper', (req, res) => {
        // Make the URL dynamic now!

        console.log('POST Request Received')
        res.status(200).send()
        const fetch = require('node-fetch');
        const data = req.body


        
        fetch(data.recipeURL)
        .then((response) => response.text())
        .then((data) => {
            console.log(vws.doItAgain(data))
        });
    })
}