/**
 * Helper for various task
 */
// Dependencies
var crypto = require('crypto')
var config = require('./config')

var helpers = {
    // Create a SHA256 hash
    hash: function(str) {
        if (typeof(str) == 'string' && str.length > 0) {
            var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex')
            return hash
        } else {
            return false
        }
    },
    // Parse json to object
    parseJsonToObject: function(str) {
        try {
            var obj = JSON.parse(str)
            return obj
        } catch(e) {
            return {}
        }
    },

    createRandomString: function(strLength) {
        strLength == typeof(strLength) == 'number' && strLength.length > 0 ? strLength : false

        if (strLength) {
            var possibleCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

            // init the return string
            var str = ''
            for (let i = 1; i <= 20; i++) {
                var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length))

                // Append the random character to the return string
                str += randomCharacter
            }
            return str
        } else {
            return false
        }
    }
}


module.exports = helpers