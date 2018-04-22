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
                        callback(400, {'Error': 'User already exist'})
                    }
                })
            } else {
                callback(400, {'Error': 'Missing required field(s).'})
            }
        },
        // Users - get
        get: function(data, callback) {
            
        },
        // Users -put
        put: function(data, callback) {
            
        },
        // Users - delete
        delete: function(data, callback) {
            
        }
    },
    ping: function(data, callback) {
        callback(200)
    },
    notFound: function(data, callback) {
        callback(404)
    }
}

module.exports = handlers