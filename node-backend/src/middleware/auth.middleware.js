import { connection, connectToDatabase } from "../db/connection.js";
import ApiError from "../utils/apiErrors.js";
import jwt from "jsonwebtoken";

async function verifyJWTtoken(req, res, next) {
    const token = req.cookies?.useraccesstoken || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.redirect('/auth/login');
    }

    try {
        // Verify the token
        const verify = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user exists in the database
        const [user] = await connection.query('SELECT * FROM users WHERE id = ?', [verify.id]);
        if (!user[0]) {
            return res.redirect('/auth/login');
        }

        // Attach the verified user info to the request object
        req.user = verify;
        res.locals.user = req.user; // Set user data to res.locals for global access

        next();

    } catch (err) {
        res.clearCookie('useraccesstoken');

        // Handle different JWT errors
        if (err.name === 'TokenExpiredError') {
            console.log('JWT token expired');
            return res.redirect('/auth/login'); // Redirect if token expired
        }

        if (err.name === 'JsonWebTokenError') {
            console.log('JWT token is invalid');
            return res.redirect('/auth/login'); // Redirect if token is invalid
        }
        // refresh the token 
    }
}

export default verifyJWTtoken;
