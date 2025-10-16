import jwt from 'jsonwebtoken';
import ResponseError from '../Error/ResponseError.js';

const CreateJwt = (data) => {
    const exp = Math.floor(Date.now() /1000) + 60; // 1 menit?
    const key = process.env.SECRET_KEY || "akuu key"
    const token = jwt.sign({
        exp,
        data
    }, key);
    return token
}

const verifJwt = (token) => {
    try {
        const key = process.env.SECRET_KEY || "akuu key"
        const decoded = jwt.verify(token, key)
        return decoded
    } catch (error) {
        throw new ResponseError("jwt not valid!", 400)
    }
}

export default { CreateJwt, verifJwt}