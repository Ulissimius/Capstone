const {Users} = require('./../../database/users.js')
const {Recipes} = require('./../../database/recipes.js')

module.exports = app => {
    // Accepts POST requests with information to create new Recipes
    app.post('/recipe', (req, res) => {
        console.log('POST Request Received to Create a Recipe')
        const data = req.body
        const authToken = req.cookies.authentication
        const cookieName = "login"
        const directions = data.directions.split("\n")
        const time = {
            prep: data.prep,
            cooking: data.cooking
        }
        
        const ingredients = []
        for (let i = 0; i < data.name.length; i++) {
            ingredients.push({name: data.name[i], amount: data.amount[i], unit: data.unit[i]})
        }

        if (authToken) {
            Users.findByToken(cookieName, authToken).then(user => {
                if(user){
                    const recipe = new Recipes({
                        name: data.title,
                        user: user.username,
                        author: data.author,
                        url: data.url,
                        description: data.description,
                        cuisine: data.cuisine,
                        type: data.type,
                        ingredients: ingredients,
                        directions: directions,
                        time: time,
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

    app.put('/modifyRecipe', (req, res) => {
        console.log('PUT Request Received to Modify a Recipe')
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
                        recipe.directions = data.directions,
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
    app.delete('/removeRecipe', (req, res) => {
        console.log('DELETE Request Received to remove a Recipe')
        const data = req.body
        const authToken = req.cookies.authentication
        const cookieName = "login"

        if(authToken) {
            Users.findByToken(cookieName, authToken).then(user => {
                if(user) {
                    Recipes.deleteOne({ _id: data.id}, function(err) {
                        if(err) {
                            return res.status(400).send({error: true})
                        }else {
                            return res.status(200).send({error: false})
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
    app.get('/list', (req, res) => {
        console.log('POST Request Received to query recipes')
        const authToken = req.cookies.authentication
        const cookieName = "login"

        if(authToken) {
            Users.findByToken(cookieName, authToken).then(user => {
                if(user) {
                    Recipes.find({ user: user.username}, function(err, docs) {
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