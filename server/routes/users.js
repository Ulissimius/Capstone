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

        Users.findByToken(data.cookieName, data.cookieValue).then(user =>{
            if(user){
                const doc = Users.findOne({name : user.username})
                doc.username = data.username
                doc.email = data.email
            }
        })
        doc.save().then(() => {
            return res.status(200).send({error: false})
        }).catch(e => {
            return res.status(400).send({error: true, message: e})
        })
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