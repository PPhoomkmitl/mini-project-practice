const jwt = require('jsonwebtoken')
const config = process.env

const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    // console.log(authHeader)
    if (!authHeader || !authHeader.startsWith('Bearer') || authHeader === undefined ||authHeader === 'Bearer null') {
        // console.log('ok here')
        return res.status(403).send('A token is required for authentication');    
    }
    else {
        const token = authHeader.split(' ')[1]
        try {
            const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET)
            req.user = decoded
            next();
        } catch (err) {
            return res.status(401).send('Invalid Token')
        }
    } 
};

module.exports = verifyAccessToken;
