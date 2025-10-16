
import session from "../utils/session.js";
import {Db} from "../lib/prisma.js";
import ResponseError from "../Error/ResponseError.js";

export const AuthMiddleware = async (req, res , next ) => {
    try {
        const authHeader = req.headers['access-token'];
        if (!authHeader) {
            throw new ResponseError(401, "Unauthorize!");
        }
        const token = authHeader
        const userSession = await session.findByToken(token);
        if(!userSession) throw new ResponseError(401, "Unauthorize user!");
        if(new Date(userSession.expires_access_token) < new Date()){
            throw new ResponseError(401, "Unauthorize!");
        }
        const user = await Db.user.findUnique({
            where:{
                id: decoded.id
            }
        })
        if(!user) throw new ResponseError(401, "Unauthorize!");
        req.user = user;
        next();
    } catch (error) {
        next(error)
    }
}


export default AuthMiddleware;
