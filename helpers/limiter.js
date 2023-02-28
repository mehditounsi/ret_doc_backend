const rateLimit = require('express-rate-limit')


module.exports.limiter = (max_request = 20, window = 480) => { 
    return rateLimit({
      windowMs: window * 60 * 1000,
      max: max_request,
      message: `you have exceeded the limit of requests, try again in  8 hours`,
      standardHeaders: true,
      legacyHeaders: false,
    })
  }