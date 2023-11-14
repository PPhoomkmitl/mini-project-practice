const jwt = require('jsonwebtoken');
const config = process.env;
const { connect } = require('../config/database');

const verifyRefreshToken = async (req, res, next) => {
    const pool = await connect();
    const connection = await pool.getConnection();
    // console.log('Database connection:', connection);
    const TokenRefresh = req.headers['authorization'];
    // const Token = req.headers.authorization.replace('Bearer ', '');
    if (!TokenRefresh || !TokenRefresh.startsWith('Bearer')) {
        return res.status(403).send('A token is required for authentication');
    }

    const refreshToken = TokenRefresh.split(' ')[1];

    try {
        const decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
        console.log(decoded);
        req.user = decoded;
        try {
            const [user] = await connection.execute('SELECT * FROM users WHERE id = ?', [decoded.user_id]); 
            // Check if the array is empty
            if (!user || user.length === 0) {
                console.error('User not found in the database');
                return res.status(401).json({ error: 'User not found in the database' });
            }    
            next();
        } catch (error) {
            console.error('Error fetching user data:', error);
            return res.status(500).json({ error: 'An error occurred while fetching user data.' });
        }

    } catch (error) {
        return res.status(401).json({ error: 'Invalid refresh token' });
    }
};

module.exports = verifyRefreshToken;
