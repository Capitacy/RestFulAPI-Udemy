/**
 * Routes handlers
 * 
 */


// Dependencies
var _data = require('./data')
var helpers = require('./helpers')

// Routes handler
var handlers = {
    // Users
    users: function(data, callback){
        var acceptableMethods = ['post', 'get', 'put', 'delete']
        if (acceptableMethods.indexOf(data.method) > -1) {
            handlers._users[data.method](data, callback)
        } else {
            callback(405)
        }
    },

    // Container for the users submethods
    _users: {
        // Users - post
        post: function(data, callback) {
            var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false
            var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false
            var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false
            var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false
            var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false


            if (firstName && lastName && phone && password && tosAgreement) {
                // Make sure that users does not already exist
                _data.read('users', phone, function(err, data) {
                    if (err) {
                        // Hash the password
                        var hashedPassword = helpers.hash(password)

                        if (hashedPassword) {
                            var userObject = {
                                firstName: firstName,
                                lastName: lastName,
                                phone: phone,
                                hashedPassword: hashedPassword,
                                tosAgreement: true
                            }


                            // Store the user
                            _data.create('users', phone, userObject, function(err) {
                                if (!err) {
                                    callback(200)
                                } else {
                                    // eslint-disable-next-line
                                    console.log(err)
                                    callback(500, {'Error': 'Could not create the new user.'})
                                }
                            })
                        } else {
                            callback(500, {'Error': 'Could not hash the user\'s password.'})
                        }
                    } else {
                        // User already exist
                        callback(400, {'Error': 'User with this phone number already exist'})
                    }
                })
            } else {
                callback(400, {'Error': 'Missing required field(s).'})
            }
        },


        // Users - get
        get: function(data, callback) {
            // check that the phone number is valid
            var phone = typeof(data.queryString.phone) == 'string' && data.queryString.phone.trim().length == 10 ? data.queryString.phone.trim() : false

            if (phone) {
                _data.read('users', phone, function(err, data) {
                    if (!err && data) {
                        // Remove hashed password field
                        delete data.hashedPassword

                        // return data to the requester
                        callback(200, data)
                    } else {
                        callback(400, {Error: 'User does not exist.'})
                    }
                })
            } else {
                callback(400, {Error: 'Missing required field.'})
            }
        },


        // Users -put
        put: function(data, callback) {
            // check for the mandatory requirement
            var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false

            // check for the optional requirements
            var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false
            var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false
            var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false


            if (phone) {
                // if any of the field to update is available
                if (firstName || lastName || password) {
                    _data.read('users', phone, function(err, userData) {
                        if (!err && userData) {
                            if (firstName) {
                                userData.firstName = firstName
                            }
                            if (lastName) {
                                userData.lastName = lastName
                            }
                            if (password) {
                                userData.hashedPassword = helpers.hash(password)
                            }
                            // Update the user file
                            _data.update('users', phone, userData, function(err) {
                                if (!err) {
                                    callback(200)
                                } else {
                                    console.log(err)
                                    callback(500, {Error: 'Error updating the file.'})
                                }
                            })
                        } else {
                            callback(500, {Error: 'Couldn\t open file for update'})
                        }
                    })
                } else {
                    callback(400, {Error: 'No field(s) to update.'})
                }
            } else {
                callback(400, {Error: 'Missing required field.'})
            }
        },


        // Users - delete
        // @TODO Cleanup any other related files
        delete: function(data, callback) {
            // check that the phone number is valid
            var phone = typeof(data.queryString.phone) == 'string' && data.queryString.phone.trim().length == 10 ? data.queryString.phone.trim() : false

            if (phone) {
                _data.read('users', phone, function(err, data) {
                    if (!err && data) {
                        // Attempt to delete data
                        _data.delete('users', phone, function(err) {
                            if (err) {
                                callback(500, {Error: 'Could not delete the specified user.'})
                            } else {
                                callback(200)
                            }
                        })
                    } else {
                        callback(400, {Error: 'User does not exist.'})
                    }
                })
            } else {
                callback(400, {Error: 'Missing required field.'})
            }
        }
    },





    // For test connection
    ping: function(data, callback) {
        callback(200)
    },




    // 404 Page not found
    notFound: function(data, callback) {
        callback(404)
    }
}

module.exports = handlers