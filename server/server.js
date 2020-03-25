// Load environment variable config
require('./config/config.js')

// Load 3rd party NPM Modules
const express = require('express')
const cookieParser = require('cookie-parser')

// Connect to the database
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true})

// Initialize the Express server
const app = express()

// Tell the server that it should expect and automatically parse JSON
app.use(express.json())

// Tell the server that it should parse cookies into a JSON object as well for easy access
app.use(cookieParser())

require('./routes/pages.js')(app)
require('./routes/users.js')(app)

// Start listening on a port for incoming requests
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`)
})