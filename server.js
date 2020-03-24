// Load environment variable config
require('./config/config.js')

// Load native Node modules
const fs = require('fs')

// Load 3rd party NPM Modules
const express = require('express')

// Initialize the Express server
const app = express()

// Tell the server that it should expect and automatically parse JSON
app.use(express.json())

// Listen for GET requests at the base URL
app.get('/', (req, res) => {
    console.log('GET Request Received')

    // Read the HTML file to send back
    const page = fs.readFileSync('./index.html', {encoding: 'utf-8'})

    // Return a 200 OK status and send the html page
    return res.status(200).send(page)
})

// Listen for POST requests at /sample endpoint
app.post('/sample', (req, res) => {
    console.log('POST Data Received')

    // Pull the JSON body out of the request data
    const data = req.body
    console.log(data)

    // Return a 200 OK status and some JSON in response
    return res.status(200).send(JSON.stringify({error: false, data: 'some other data'}))
})

// Start listening on a port for incoming requests
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`)
})