/**
 * Configurations for application to import and use.
 */

// Environment container
var environments = {
    // environment variables for staging (default) environment
    staging: {
        httpPort: 3000,
        httpsPort: 3001,
        envName: 'STAGING'
    },
    // environment variables for production environment
    production: {
        httpPort: 5000,
        httpsPort: 5001,
        envName: 'PRODUCTION'
    }
}

// Export environment intelligently
module.exports = environments[process.env.NODE_ENV] !== undefined ? environments[process.env.NODE_ENV] : environments.staging
