const {Users} = require('./../../database/users.js')
const {Recipes} = require('./../../database/recipes.js')

module.exports = app => {
    // Listen for GET requests at the base URL
    app.get('/', (req, res) => {
        console.log('GET Request Received at Home Page')

        const authToken = req.cookies.authentication

        if (authToken) {
            Users.findByToken('login', authToken).then(user => {
                if (!user) {
                    console.log('No User Found')
                    // Return a 200 OK status and send the html page
                    return res.render('pages/home/home.hbs', {
                        assetUrl: '/pages/home/home',
                        user: null
                    })
                } else {
                    console.log(`Visitor is Logged In as ${user.username}`)
                    // Return a 200 OK status and send the html page
                    return res.render('pages/home/home.hbs', {
                        assetUrl: '/pages/home/home',
                        user: user
                    })
                }
            })
        } else {
            console.log('User Not Logged In')
            // Return a 200 OK status and send the html page
            return res.render('pages/home/home.hbs', {
                assetUrl: '/pages/home/home',
                user: null
            })
        }
    })

    app.get('/list', (req, res) => {
        console.log('GET Request Received for List Page')

        const authToken = req.cookies.authentication
        
        if (authToken) {
            Users.findByToken('login', authToken).then(user => {
                if (!user) {
                    console.log('No User Found')
                    // Return a 200 OK status and send the html page
                    return res.render('pages/list/list.hbs', {
                        assetUrl: '/pages/list/list',
                        user: null
                    })
                } else {
                    console.log(`Visitor is Logged In as ${user.username}`)
                    Recipes.find({user: user.username}).then(recipe => {
                        if (!recipe) {
                            // Return a 200 OK status and send the html page
                            return res.render('pages/list/list.hbs', {
                                assetUrl: '/pages/list/list',
                                user: user
                            })
                        } else {
                            // Return a 200 OK status and send the html page
                            console.log(recipe)
                            return res.render('pages/list/list.hbs', {
                                assetUrl: '/pages/list/list',
                                user: user,
                                recipes: recipe
                            })
                        }
                    })
                }
            })
        } else {
            console.log('User Not Logged In')
            // Return a 200 OK status and send the html page
            return res.render('pages/list/list.hbs', {
                assetUrl: '/pages/list/list',
                user: null
            })
        }
    })

    app.get('/account', (req, res) => {
        console.log('GET Request Received at Account Page')

        const authToken = req.cookies.authentication

        if (authToken) {
            Users.findByToken('login', authToken).then(user => {
                if (!user) {
                    console.log('No User Found')
                    // Return a 200 OK status and send the html page
                    return res.render('pages/account/account.hbs', {
                        assetUrl: '/pages/account/account',
                        user: null
                    })
                } else {
                    console.log(`Visitor is Logged In as ${user.username}`)
                    // Return a 200 OK status and send the html page
                    return res.render('pages/account/account.hbs', {
                        assetUrl: '/pages/account/account',
                        user: user
                    })
                }
            })
        } else {
            console.log('User Not Logged In')
            // Return a 200 OK status and send the html page
            return res.render('pages/account/account.hbs', {
                assetUrl: '/pages/account/account',
                user: null
            })
        }
    })
}