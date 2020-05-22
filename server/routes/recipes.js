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
                if (user) {
                    let urlObj = {}
                    const time = {
                        prep: data.prep_time,
                        cooking: data.cook_time
                    }
                    if (typeof data.url == 'string') {
                        if (data.url == 'N/A') {
                            urlObj = {
                                short_url: data.url,
                                full_url: data.url
                            }
                        } else {
                            urlObj = {
                                short_url: (new URL(data.url)).hostname, // Shortens the URL to just the hostname (https://www.website.com/page1/content -> www.website.com)
                                full_url: data.url
                            }
                        }
                    } else {
                        urlObj = data.url
                    }

                    const recipe = new Recipes({
                        name: data.title,
                        user: user.username,
                        author: data.author,
                        url: urlObj,
                        description: data.description,
                        cuisine: data.cuisine,
                        type: data.type,
                        ingredients: (typeof data.ingredients == 'string' ? data.ingredients.split("\n") : data.ingredients),
                        directions: (typeof data.directions == 'string' ? data.directions.split("\n") : data.directions),
                        time: time,
                        servings: data.servings,
                        notes: (typeof data.notes == 'string' ? data.notes.split("\n") : data.notes),
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

    app.put('/editRecipe', (req, res) => {
        console.log('PUT Request Received to Modify a Recipe')
        const data = req.body
        const authToken = req.cookies.authentication
        const cookieName = "login"

        if (authToken) {
            Users.findByToken(cookieName, authToken).then(user => {
                if(user) {
                    let urlObj = {}
                    const time = {
                        prep: data.prep_time,
                        cooking: data.cook_time
                    }
                    urlObj = {
                        short_url: (new URL(data.url)).hostname, // Shortens the URL to just the hostname (https://www.website.com/page1/content -> www.website.com)
                        full_url: data.url
                    }

                    Recipes.findById(data.id).then(recipe => {
                        console.log(recipe)
                        recipe.name = data.title,
                        recipe.user = user.username,
                        recipe.author = data.author,
                        recipe.url = urlObj,
                        recipe.description = data.description,
                        recipe.cuisine = data.cuisine,
                        recipe.type = data.type,
                        recipe.ingredients = data.ingredients.split("\n"),
                        recipe.directions = data.directions.split("\n"),
                        recipe.time = time,
                        recipe.servings = data.servings,
                        recipe.notes = data.notes.split("\n"),
                        recipe.calorie = data.calories,
                        recipe.image = data.image
                        recipe.save().then(() => {
                            console.log('Recipe Added Successfully.')
                            return res.status(200).send({error: false})
                        }).catch(e => {
                            console.error(e)
                            return res.status(400).send({error: true, message: e})
                        })
                    }).catch(e => {
                        console.error(e)
                        return res.status(400).send({error: true, message: e})
                    })
                } else {
                    console.error('User Not Found')
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

    // Accepts POST requests with information to remove a Recipe
    app.delete('/removeRecipe', (req, res) => {
        console.log('DELETE Request Received to remove a Recipe')
        const data = req.body
        const authToken = req.cookies.authentication
        const cookieName = "login"

        if(authToken) {
            Users.findByToken(cookieName, authToken).then(user => {
                if(user) {
                    Recipes.deleteOne({ _id: data.id, user: user.username}, function(err) {
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

    // Accepts GET requests to fetch favorite recipes
    app.get('/getFavorites', (req, res) => {
        console.log('GET Request Received to fetch favorites')
        const authToken = req.cookies.authentication
        const cookieName = "login"

        if(authToken) {
            Users.findByToken(cookieName, authToken).then(user => {
                if(user) {
                    Recipes.find({ user: user.username }, 'favorite').then(favorites => {
                        return res.status(200).send({error: false, favorites})
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

    app.put('/updateFavorites', (req, res) => {
        console.log('GET Request Received to update favorites')
        const data = req.body
        var idTrueArr = []
        var idFalseArr = []
        data.forEach(elem => {
            if (elem.favorite == true) {
                idTrueArr.push(elem._id)
            } else {
                idFalseArr.push(elem._id)
            }
        });
        const authToken = req.cookies.authentication
        const cookieName = "login"

        if(authToken) {
            Users.findByToken(cookieName, authToken).then(user => {
                if(user) {
                    if (idTrueArr) {
                        Recipes.update({ _id: { $in: idTrueArr }}, { $set: { favorite: true }}, { multi: true }).then(() => {
                            console.log('Favorites Updated Successfully.')
                        }).catch(e => {
                            console.log(e)
                            return res.status(400).send({error: true})
                        })
                    } 
                    if (idFalseArr) {
                        Recipes.update({ _id: { $in: idFalseArr }}, { $set: { favorite: false }}, { multi: true }).then(() => {
                            console.log('Favorites Updated Successfully.')
                        }).catch(e => {
                            console.log(e)
                            return res.status(400).send({error: true})
                        })
                    }
                    return res.status(200).send({error: false})
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