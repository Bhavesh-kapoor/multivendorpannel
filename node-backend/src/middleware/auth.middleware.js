import { connection, connectToDatabase } from "../db/connection.js";
import ApiError from "../utils/apiErrors.js";
import jwt from "jsonwebtoken";

async function verifyJWTtoken(req, res, next) {
    const token = req.cookies?.useraccesstoken || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        res.redirect('/auth/login');
    }

    const verify = jwt.verify(token, process.env.JWT_SECRET);
    if (!verify) {
        res.redirect('/auth/login');
    }

    // now check if user exist 
    const [user] = await connection.query('SELECT * FROM users where id =?', [verify.id]);
    if (!user[0]) {
        res.redirect('/auth/login');
    }

    req.user =  verify;
    next();

}


export default verifyJWTtoken;