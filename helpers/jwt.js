var jwt = require('jsonwebtoken');
const configuration = require('../config/config')
const Errors = require('../helpers/errors');
const Logger = require("winston");

const JWT_SIGN_SECRET = "" + configuration.jwt.jwt_secret;

// Exported functions
module.exports = {
  generateTokenForAdmin: async function(utilisateur){
    try {
      return jwt.sign({
        login: utilisateur,
      },
  
        JWT_SIGN_SECRET,
        {
          expiresIn: '1200h'
        })
    } catch (error) {
      console.log(error)
      Logger.error(error)
      throw error
    }
  },
  parseAuthorization: function (authorization) {
    return (authorization != null) ? authorization.replace('Bearer ', '') : null;
  },
  // ------------ Verifiy Authentication -------------
  isAdmin: function (req, res, next) {
    var auth = req.headers['authorization'];
    var token = module.exports.parseAuthorization(auth);
    if (!token) return res.status(402).send("Access denied. No token provided.");
    try {
      const jwtToken = jwt.decode(token);
      if (jwtToken != null)
        if (jwtToken.login !== "root") {
          res.status(402).send("Access denied. need more rights.")
        };
      next();
    } catch (ex) {
      res.status(402).send("Invalid token.");
    }
  }
}



