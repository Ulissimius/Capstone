const vws = require('./cheerio'); // cheerio.js provides doItAgain()

module.exports = app => {
    app.post('/scraper', (req, res) => {
        // Fetches Text HTML based on passed URL, then passes the results to cheerio.js

        console.log('POST Request Received');
        const fetch = require('node-fetch');
        const rURL = req.body;
        let results = null;
        // let message = null;

        fetch(rURL.recipeURL)
        .then((response) => response.text())
        .then((data) => { 
            results = vws.doItAgain(data, rURL.recipeURL);
            console.log(results);
            if (results.ingredients.length < 0) {
                //It worked, but filled out no data. Try again.
                res.status(200).send({error: true, message: 'Oops! Something went wrong, try again.'})
            } else if (results.ingredients.length > 0) {
                //It worked! Return results
                res.status(200).send({error: false, message: 'Success! The recipe has been copied!', results})
            } else {
                //It did not work. Error.
                res.status(200).send({error: true, message: 'Something went wrong. Try a different website or create your own recipe!'})
            }
        }).catch((error) => console.error(error));
    });
};