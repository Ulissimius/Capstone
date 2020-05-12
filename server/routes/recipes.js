const {Users} = require('./../../database/users.js')
const {Recipes} = require('./../../database/recipes.js')

module.exports = app => {
    // Accepts POST requests with information to create new Recipes
    app.post('/recipe', (req, res) => {
        console.log('POST Request Received to Create a Recipe')
        const data = req.body
        const authToken = req.cookies.authentication
        const cookieName = "login"
        // const directions = data.directions.split("\n")
        const time = {
            prep: data.prep_time,
            cooking: data.cook_time
        }
        if (typeof data.url == 'string') {
            data.url = {
                short_url: (new URL(data.url)).hostname, // Shortens the URL to just the hostname (https://www.website.com/page1/content -> www.website.com)
                full_url: data.url
            }
        }

        if (authToken) {
            Users.findByToken(cookieName, authToken).then(user => {
                if (user) {
                    const recipe = new Recipes({
                        name: data.title,
                        user: user.username,
                        author: data.author,
                        url: data.url,
                        description: data.description,
                        cuisine: data.cuisine,
                        type: data.type,
                        ingredients: data.ingredientArr,
                        directions: (typeof data.directions == 'string' ? data.directions.split("\n") : data.directions),
                        time: time,
                        servings: data.servings,
                        calorie: data.calories,
                        image: data.image
                    })
                    recipe.save().then(() => {
                        console.log('Recipe Added Successfully.')
                        return res.status(200).send({error: false})
                    }).catch(e => {
                        console.error(e)
                        return res.status(400).send({error: true, message: e})
                    })
                } else {
                    console.log('User not found.')
                    return res.status(400).send({error: true, message: 'User Not Found'})
                }
            }).catch(e => {
                console.error(e)
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
        const time = {
            prep: data.prep_time,
            cooking: data.cook_time
        }
        data.url = {
            short_url: (new URL(data.url)).hostname, // Shortens the URL to just the hostname (https://www.website.com/page1/content -> www.website.com)
            full_url: data.url
        }
        if (authToken) {
            Users.findByToken(cookieName, authToken).then(user => {
                if(user) {
                    Recipes.findById(data.objectID).then(recipe => {
                        recipe.name = data.title,
                        recipe.user = data.username,
                        recipe.author = data.author,
                        recipe.url = data.url,
                        recipe.description = data.description,
                        recipe.cuisine = data.cuisine,
                        recipe.type = data.type,
                        recipe.ingredients = data.ingredientArr,
                        recipe.directions = data.directions.split("\n"),
                        recipe.time = time,
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

    // Accepts POST requests with information to remove a Recipe
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
                            console.log(err)
                            return res.status(400).send({error: true, message: err})
                        }else {
                            return res.status(200).send({error: false})
                        }
                    }).catch(e => {
                        console.log(e)
                        return res.status(400).send({error: true, message: e})
                    })
                } else {
                    console.log('User Not Found')
                    return res.status(400).send({error: true, message: 'User Not Found'})
                }
            }).catch(e => {
                console.log(e)
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