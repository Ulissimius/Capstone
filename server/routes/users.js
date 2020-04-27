const {Users} = require('./../../database/users.js')

module.exports = app => {
    // Accepts POST requests with information to create new users
    app.post('/user', (req, res) => {
        console.log('POST Request Received to Create a User')
        const data = req.body

        const user = new Users({
            email: data.email,
            username: data.username,
            password: data.password
        })

        user.save().then(() => {
            return res.status(200).send({error: false})
        }).catch(e => {
            return res.status(400).send({error: true, message: e})
        })
    })

    app.post('/modify', (req, res) => {
        console.log('POST Request Received to Modify a User')
        const data = req.body
        const authToken = req.cookies.authentication
        const cookieName = "login"
        if (authToken) {
            Users.findByToken(cookieName, authToken).then(user => {
                if(user){
                    user.username = data.username
                    user.email = data.email
                    user.save().then(() => {
                        return res.status(200).send({error: false})
                    }).catch(e => {
                        return res.status(400).send({error: true, message: e})
                    })
                } else {
                    return res.status(400).send({error: true, message: 'User Not Found'})
                }
            }).catch(e => {
                return res.status(400).send({error: true, message: e})
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

    app.post('/modifyPassword', (req, res) => {
        console.log('POST Request Received to Modify a User')
        const data = req.body
        const authToken = req.cookies.authentication
        const cookieName = "login"

        if (authToken) {
            Users.findByToken(cookieName, authToken).then(user => {
                if(user){
                    user.username = data.username
                    user.email = data.email
                    user.password = data.password
                    user.save().then(() => {
                        return res.status(200).send({error: false})
                    }).catch(e => {
                        return res.status(400).send({error: true, message: e})
                    })
                } else {
                    return res.status(400).send({error: true, message: 'User Not Found'})
                }
            }).catch(e => {
                return res.status(400).send({error: true, message: e})
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

    // Accepts POST requests with information to sign in and receive an authentication token
    app.post('/login', (req, res) => {
        console.log('POST Request Received to Sign In')
        const data = req.body

        Users.findByCredentials(data.email, data.password).then(user => {
            if (user) {
                user.generateToken('login').then(token => {
                    return res.status(200).send({error: false, token})
                })
            } else {
                return res.status(400).send({error: true, message: 'User Not Found'})
            }
        }).catch(e => {
            return res.status(400).send({error: true, message: e})
        })
    })
}