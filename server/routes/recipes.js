const {Users} = require('./../../database/users.js')
const {Recipes} = require('./../../database/recipes.js')

module.exports = app => {
    function isEmptyObj(obj) { // Checks for empty objects, returns true/false
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

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
                        author_user: (typeof data.auth_user === 'undefined' ? user.username : (data.auth_user === 'N/A' ? user.username : data.auth_user)),
                        author: data.author,
                        url: urlObj,
                        description: data.description,
                        cuisine: data.cuisine,
                        type: data.type,
                        ingredients: (typeof data.ingredients === 'string' ? data.ingredients.split("\n") : data.ingredients),
                        directions: (typeof data.directions === 'string' ? data.directions.split("\n") : data.directions),
                        time: time,
                        servings: data.servings,
                        notes: (typeof data.notes === 'string' ? data.notes.split("\n") : data.notes),
                        calorie: data.calories,
                        image: data.images
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
                    Recipes.findById(data.id).then(recipe => {
                        recipe.name = data.title,
                        recipe.user = user.username,
                        recipe.author_user = (data.auth_user === 'N/A' ? user.username : data.auth_user),
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
                        recipe.image = (typeof data.images !== 'undefined' ? data.images : (Object.keys(recipe.image).length === 0 ? recipe.image : {large: 'https://i.ibb.co/xJhWBQz/e1e674b44610.jpg',medium: 'https://i.ibb.co/J5nVGPr/e1e674b44610.jpg',thumb: 'https://i.ibb.co/3B12jHS/e1e674b44610.jpg'}))
                        recipe.save().then(() => {
                            console.log('Recipe Updated Successfully.')
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
        console.log('PUT Request Received to update favorites')
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

    app.post('/uploadImg', (req, res) => {
        console.log('POST Request Received to Upload Img')
        const fetch = require('node-fetch');
        const data = req.body
        const authToken = req.cookies.authentication
        const cookieName = "login"
    
        if (authToken) {
            Users.findByToken(cookieName, authToken).then(user => {
                if(user) {
                    const apiKey = 'e310a405942e7d8ec4df95cddb2099d4'
                    var formData = new URLSearchParams()
                    formData.append('image', data.img)
                    fetch('https://api.imgbb.com/1/upload?key=' + apiKey, {
                        method: 'POST',
                        body: formData
                    }).then((response) => response.json()).then((data) => {
                        if (!data.error) {
                            return res.status(200).send({error: false, data})
                        } else {
                            console.log(data.error)
                            return res.status(400).send({error: true})
                        }
                    }).catch((error) => {
                        console.error(error)
                        return res.status(400).send({error: true})
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

    app.post('/copyRecipe', (req, res) => {
        console.log('POST Request Received to Copy a Recipe')
        const data = req.body
        const authToken = req.cookies.authentication
        const cookieName = "login"

        if (authToken) {
            Users.findByToken(cookieName, authToken).then(user => {
                if (user) {
                    Recipes.findById(data.id).then(recipe => {
                        const recipeCopy = new Recipes({
                            name: recipe.name,
                            user: user.username,
                            author_user: recipe.author_user,
                            author: recipe.author,
                            url: recipe.url,
                            description: recipe.description,
                            cuisine: recipe.cuisine,
                            type: recipe.type,
                            ingredients: recipe.ingredients,
                            directions: recipe.directions,
                            time: recipe.time,
                            servings: recipe.servings,
                            notes: recipe.notes,
                            calorie: recipe.calorie,
                            image: recipe.image
                        })
                        recipeCopy.save().then(() => {
                            console.log('Recipe Copied Successfully.')
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
}