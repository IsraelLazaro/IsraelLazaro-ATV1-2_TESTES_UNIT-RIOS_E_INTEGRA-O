import {sign, SignOptions, verify} from "jsonwebtoken";
import "dotenv/config"; 

const options = {
    expiresIn: process.env.TOKEN_EXPIRATION
} as SignOptions;

const privateKey = process.env.PRIVATE_KEY as string;

function generateToken(username : string, role : string){
    return sign({user: {username, role}}, privateKey, options);
};

function verifyToken(token : string){
    return verify(token, privateKey);
};

export {generateToken, verifyToken};