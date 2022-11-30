const jwt = require('jsonwebtoken');
const { User } = require('../model/User');
require('dotenv').config();

// const config = require('config');
async function auth(req,res,next){
    const token = req.header('x-auth-token');
    if(!token) res.status(401).send('Access denied. No token provided');
    try{
        const decoded = jwt.verify(token,process.env.SecrectToken);
        req.user = decoded;
        // console.log(req.user.decoded);
        next();
    }
    catch(ex){
        res.status(400).send('Invalid token');
    }
}
module.exports = auth;