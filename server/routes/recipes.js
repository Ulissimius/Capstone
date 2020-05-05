const {Users} = require('./../../database/users.js')
const {Recipes} = require('./../../database/recipes.js')

module.exports = app => {
    // Accepts POST requests with information to create new Recipes
    app.post('/recipe', (req, res) => {
        console.log('POST Request Received to Create a Recipe')
        const data = req.body
        const authToken = req.cookies.authentication
        const cookieName = "login"

        if (authToken) {
            Users.findByToken(cookieName, authToken).then(user => {
                if(user){
                    const recipe = new Recipes({
                        name: data.name,
                        user: user.username,
                        author: data.author,
                        description: data.description,
                        cuisine: data.cuisine,
                        type: data.type,
                        ingredients: data.ingredients,
                        steps: data.steps,
                        time: data.time,
                        servings: data.servings,
                        calorie: data.calories,
                        image: data.image
                    })

                    recipe.save().then(() => {
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

    app.post('/modifyRecipe', (req, res) => {
        console.log('POST Request Received to Modify a Recipe')
        const data = req.body
        const authToken = req.cookies.authentication
        const cookieName = "login"
        if (authToken) {
            Users.findByToken(cookieName, authToken).then(user => {
                if(user) {
                    Recipes.findById(data.objectID).then(recipe => {
                        recipe.name = data.name,
                        recipe.user = data.username,
                        recipe.author = data.author,
                        recipe.description = data.description,
                        recipe.cuisine = data.cuisine,
                        recipe.type = data.type,
                        recipe.ingredients = data.ingredients,
                        recipe.steps = data.steps,
                        recipe.time = data.time,
                        recipe.servings = data.servings,
                        recipe.calorie = data.calories,
                        recipe.image = data.image
                        recipe.save().then(() => {
                            return res.status(200).send({error: false})
                        }).catch(e => {
                            return res.status(400).send({error: true, message: e})
                        })
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

    // Accepts POST requests with information to revome a Recipe
    app.post('/removeRecipe', (req, res) => {
        console.log('POST Request Received to remove a Recipe')
        const data = req.data
        const authToken = req.cookies.authentication
        const cookieName = "login"

        if(authToken) {
            Users.findByToken(cookieName, authToken).then(user => {
                if(user) {
                    Recipes.remove({ _id: data.objectID, user: user.username }).then( res => {
                        if(res > 0) {
                            return res.status(200).send({error: false})
                        } else {
                            return res.status(400).send({error: true})
                        }
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

    // Accepts POST requests to fill out users List page
    app.post('/list', (req, res) => {
        console.log('POST Request Received to query recipes')
        const data = req.body
        const authToken = req.cookies.authentication
        const cookieName = "login"

        if(authToken) {
            Users.findByToken(cookieName, authToken).then(user => {
                if(user) {
                    Recipes.find({ name: user.username}, function(err, docs) {
                        if(err) {
                            return res.status(400).send({error: true, message: err})
                        } else {
                            return res.status(200).send({error: false, data: docs})
                        }
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
}