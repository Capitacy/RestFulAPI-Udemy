/**
 * Library for storing and editing data
 */


//  Dependencies
var fs = require('fs')
var path  = require('path')
var helpers = require('./helpers')


// container for the module
var lib = {
    baseDir: path.join(__dirname, '/../.data/'),
    create: function(dir, file, data, callback) {
        // Open file in write mode
        fs.open(lib.baseDir+ dir+'/'+file+'.json', 'wx', function(err, fileDescriptor) {
            if (!err && fileDescriptor) {
                // Convert data to string
                var stringData = JSON.stringify(data)

                // write to file
                fs.writeFile(fileDescriptor, stringData, function(err) {
                    if(!err) {
                        fs.close(fileDescriptor, function(err) {
                            if (err) {
                                callback('Error closing new file.')
                            } else {
                                callback(false)
                            }
                        })
                    } else {
                        callback('Error writing to new file.')
                    }
                })
            } else {
                callback('Could not create new file, it may already exist.')
            }
        })
    },
    read: function(dir,file,callback){
        fs.readFile(lib.baseDir+dir+'/'+file+'.json', 'utf8', function(err,data){
            if(!err && data){
                var parsedData = helpers.parseJsonToObject(data)
                callback(false,parsedData)
            } else {
                callback(err,data)
            }
        })
    }
}



module.exports = lib