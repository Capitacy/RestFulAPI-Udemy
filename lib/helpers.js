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
    }
}


module.exports = helpers