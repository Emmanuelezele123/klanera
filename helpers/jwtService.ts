require("dotenv").config()
const jwt = require('jsonwebtoken')
const secret = process.env.SECRET
const expiryDate = process.env.EXPIRY_DATE
const ACCESS_TOKEN_EXPIRATION_TIME = '15m'
const REFRESH_TOKEN_EXPIRATION_TIME = '7d'
exports.createToken = (user:any) => {
    try {
        let token = jwt.sign({
            id: user._id,
            username: user.username,
            email:user.email
        }, secret, {expiresIn:expiryDate})
        return token
    } catch(err) {
        console.log(err)
        return null
    }
}

exports.createAccessToken = (user: any): any => {
    const payload = {
        id: user._id,
        username: user.username,
        email:user.email
    }
    return jwt.sign(payload, secret, { expiresIn: ACCESS_TOKEN_EXPIRATION_TIME })
  }
  
  exports.createRefreshToken = (user:any): any => {
    const payload = {
        id: user._id,
        username: user.username,
        email:user.email
    }
    return jwt.sign(payload, secret, { expiresIn: REFRESH_TOKEN_EXPIRATION_TIME })
  }



exports.decodeToken = (token:any) => {
    try {
        let decodedToken = jwt.verify(token, secret)
        return decodedToken
    } catch(error) { 
        console.log(error)
        return null
    }
}