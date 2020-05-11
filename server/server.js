// Load environment variable config
require('./config/config.js')

// Load Native Node Modules
const path = require('path')

// Load 3rd party NPM Modules
const express = require('express')
const cookieParser = require('cookie-parser')
const hbs = require('hbs')

// Connect to the database
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true})

// Initialize the Express server
const app = express()

// Define Handlebars File Paths
const partialDir = path.join(__dirname, '/../views/partials')
const staticDir = path.join(__dirname, './../views')

// Configure Handlebars
hbs.registerPartials(partialDir)
hbs.localsAsTemplateData(app)

// Tell the server that it should use Handlebars to render pages
app.set('view engine', 'hbs')

// Tell the server where static files can be found
app.use(express.static(staticDir))

// Tell the server that it should expect and automatically parse JSON
app.use(express.json())

// Tell the server that it should parse cookies into a JSON object as well for easy access
app.use(cookieParser())

require('./routes/pages.js')(app)
require('./routes/users.js')(app)
require('./routes/scraper.js')(app)
require('./routes/recipes.js')(app)

// Start listening on a port for incoming requests
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`)
})