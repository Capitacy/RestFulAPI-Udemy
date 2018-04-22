/**
 * Title: Core Server Controller
 * Description: HTTP server for our little application.
 * Author: Oshan Shrestha
 * Date: 04/10/2018
*/

// Dependencies
var http = require('http')
var https = require('https')
var url = require('url')
var stringDecoder = require('string_decoder').StringDecoder
var config = require('./lib/config')
var handlers = require('./lib/handlers')
var fs = require('fs')
var helpers = require('./lib/helpers')

// Morphing the HTTP server
var httpServer = http.createServer(function(req, res) {
    unifiedServer(req, res)
})


// options for HTTPS server morph
var httpsServerOptions = {
    key: fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/cert.pem')
}

// Morphing the HTTPS server
var httpsServer = https.createServer(httpsServerOptions, function(req, res) {
    unifiedServer(req, res)
})

// Unified server handler for http and https
var unifiedServer = function(req, res) {
    
    // get the payloads
    var decoder = new stringDecoder('utf-8')
    var buffer = ''
    req.on('data', function(dat) {
        buffer += decoder.write(dat)
    })

    req.on('end', function() {
        // End the bufffer capture
        buffer += decoder.end()

        // collect data for process from request
        var trimmedUrl =  url.parse(req.url, true).pathname.replace(/^\/+|\/+$/g,'')
        var reqData = {
            'trimmedPath':trimmedUrl,
            'queryString': url.parse(req.url, true).query,
            'method': req.method.toLowerCase(),
            'headers': req.headers,
            'payload': helpers.parseJsonToObject(buffer)
        }
        
        // Choose the route handler
        var chosenHandler = typeof(router[trimmedUrl]) !== 'undefined' ? router[trimmedUrl] : handlers.notFound
        chosenHandler(reqData, function(stsCode, payload) {

            // set default statusCode and payload
            stsCode = typeof(stsCode) == 'number' ? stsCode : 200
            payload = typeof(payload) == 'object' ? payload : {}

            // convert object to string
            var payloadStringToUser = JSON.stringify(payload)

            // Respond to the user
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(stsCode)
            res.end(payloadStringToUser)
            
            // Log data
            // eslint-disable-next-line
            console.log("Returned data:\n",{"StatusCode": stsCode, "PayloadReturned": payloadStringToUser})
        })
    })
    
}

// HTTP server init
httpServer.listen(config.httpPort, function() {
    // Alert admin about the server's state
    // eslint-disable-next-line
    console.log(`HTTP server is now live at port ${config.httpPort}.`)
})

// HTTPS server init
httpsServer.listen(config.httpsPort, function() {
    // Alert admin about the server's state
    // eslint-disable-next-line
    console.log(`HTTPS server is now live at port ${config.httpsPort}`)
})

// Routes Controller
var router = {
    ping: handlers.ping,
    users: handlers.users
}