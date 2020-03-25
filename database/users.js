const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// Define the fields that make up our User schema in the database
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    tokens: [{
        name: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        expiry: {
            type: Number
        }
    }]
})

// Function to generate new JSONWebTokens
UserSchema.methods.generateToken = function(tokenName) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = this

            // Generate a new token using this users unique ID, the token name, and the JWT Secret environment variable
            const token = jwt.sign({
                _id: user._id.toHexString(),
                name: tokenName
            }, process.env.JWT_SECRET).toString()

            // Try to remove a previous token to make sure we don't have multiple login tokens or something
            await user.removeToken(tokenName)

            // Push the new token into the tokens array
            user.tokens.push({
                name: tokenName,
                value: token
            })

            // Save the user in the database and then return the token to be sent back to the user
            user.save().then(() => {
                resolve(token)
            }).catch(e => {
                reject(e)
            })
        } catch(e) {
            reject(e)
        }
    })
}

// Function to try to find and remove any existing tokens
UserSchema.methods.removeToken = function(tokenName) {
    return new Promise((resolve, reject) => {
        const user = this

        resolve(user.update({
            $pull: {
                tokens: {
                    name: tokenName
                }
            }
        }))
    })
}

// Takes user credentials and compares them against the encrypted data to verify
UserSchema.statics.findByCredentials = function(email, password) {
    return new Promise((resolve, reject) => {
        const User = this

        User.findOne({email}).then(user => {
            if (!user) { reject('No User With Email') }

            bcrypt.compare(password, user.password, (error, response) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(user)
                }
            })
        })
    })
}

// Takes a token name and a value to find a user by token.
UserSchema.statics.findByToken = function(tokenName, value) {
    return new Promise((resolve, reject) => {
        const User = this

        let decodedToken

        try {
            decodedToken = jwt.verify(value, process.env.JWT_SECRET)
        } catch (e) {
            reject(e)
        }

        resolve(User.findOne({
            _id: decodedToken._id,
            'tokens.name': tokenName,
            'tokens.value': value
        }))
    })
}

// Runs before any changes to a User are saved to the database
// We check to see if the password is one of the fields being changed
// And if so, salt/hash the password to encrypt it
UserSchema.pre('save', function(next) {
    const user = this

    // Check if the modified field is password
    if (user.isModified('password')) {
        // Generate salt to encrypt the password with
        bcrypt.genSalt(10, (err, salt) => {
            if (err) { console.log(err) }

            // Use the salt to hash the password
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) { console.log(err) }

                // Set the new password as the hash value
                user.password = hash

                // Allow the rest of the save process to complete
                next()
            })
        })
    } else {next()}
})

const Users = mongoose.model('Users', UserSchema)

module.exports = {Users}