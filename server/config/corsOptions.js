const allowedOrigins = require('./allowedOrigins')

const corsOpions = {
    origin: (origin, callback) => {
        // console.log('allowedOrigins: ', allowedOrigins);
        // console.log("allowedOrigins.indexOf(origin): ", allowedOrigins.indexOf(origin));
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else (
            callback(new Error('Not allowed by CORS'))
        )
    },
    credentials: true,
    optionsSuccesStatus: 200
}

module.exports = corsOpions