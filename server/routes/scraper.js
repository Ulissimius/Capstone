const vws = require('./cheerio'); // cheerio.js provides doItAgain()

module.exports = app => {
    app.post('/scraper', (req, res) => {
        // Fetches Text HTML based on passed URL, then passes the results to cheerio.js

        console.log('POST Request Received - Webscraper');
        const fetch = require('node-fetch');
        const rURL = req.body;
        let results = null;

        fetch(rURL.newURL)
        .then((response) => response.text())
        .then((data) => { 
            results = vws.doItAgain(data, rURL.newURL);
            // console.log(results)

            if (typeof results.images !== 'undefined' && typeof results.images === 'string' && results.images.length) {
                const apiKey = 'e310a405942e7d8ec4df95cddb2099d4'
                var formData = new URLSearchParams()
                formData.append('image', results.images)
                console.log('Sending POST to imgbb API')

                fetch('https://api.imgbb.com/1/upload?key=' + apiKey, {
                    method: 'POST',
                    body: formData
                }).then((response) => response.json()
                ).then((data) => {
                    // Replace results.image with data.image object
                    if (typeof data.data.medium !== 'undefined') {
                        results.images = {
                            large: data.data.image.url,
                            medium: data.data.medium.url,
                            thumb: data.data.thumb.url
                        }
                    } else {
                        results.images = {
                            large: data.data.image.url,
                            thumb: data.data.thumb.url
                        }
                    }
                    returnStatus()
                }).catch((error) => {
                    console.error(error)
                    returnStatus()
                })
            } else {
                returnStatus()
            }
        }).catch((error) => {
            console.error(error)
            return res.status(500).send({error: true})
        });

        function returnStatus() {
            if (typeof results != 'object' ) {
                //It worked, but filled out no data. Try again.
                res.status(400).send({error: true, message: 'Oops! Something went wrong, try again.', results})
            } else {
                //It worked! Return results
                res.status(200).send({error: false, message: 'Success! The recipe has been copied!', results})
            }
        }
    });
};