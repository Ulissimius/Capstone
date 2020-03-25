const {Users} = require('./../../database/users.js')

module.exports = app => {
    // Listen for GET requests at the base URL
    app.get('/', (req, res) => {
        console.log('GET Request Received at Home Page')

        const authToken = req.cookies.authentication

        if (authToken) {
            Users.findByToken('login', authToken).then(user => {
                if (!user) {
                    console.log('No User Found')
                } else {
                    console.log(`Visitor is Logged In as ${user.username}`)
                }
            })
        }

        // Return a 200 OK status and send the html page
        return res.render('pages/home/home.hbs')
    })
}