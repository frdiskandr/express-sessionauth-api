import {ValidateSchema} from "../models/Validate.js";
import hashing from "../utils/hashing.js";
import {Db} from "../lib/prisma.js";
import ResponseError from "../Error/ResponseError.js";
import jwt from "../utils/jwt.js";
import session from "../utils/session.js";
import { LoginSchema, userSchema } from "../models/schema/userSchema.js";

class AuthController {
    static async signUp(req, res, next) {
        try {
            const user = await ValidateSchema(userSchema, req.body);
            const existingUser = await Db.user.findUnique({ where: { email: user.email } });
            if (existingUser) {
                throw new ResponseError(400, "User already exists");
            }
            user.password = await hashing.HashPassword(user.password);
            const result = await Db.user.create({
                data: user
            });
            res.status(201).json({
                success: true,
                message: "created!",
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async signIn(req, res, next) {
        try {
            const userData = await ValidateSchema(LoginSchema, req.body);
            const user = await Db.user.findUnique({
                where: {
                    email: userData.email
                }
            });
            if (!user) throw new ResponseError(401, "unauthorize!");
            const passwordVerify = await hashing.VerifPassword(userData.password, user.password);
            if (!passwordVerify) throw new ResponseError(401, "unauthorize!");
            const result = await session.create(user.id);
            res.status(200).json({
                success: true,
                message: "sign in!",
                data: {
                    access_token: result.access_token,
                    refresh_token: result.refresh_token
                }
            });
        } catch (error) {
            next(error);
        }
    }

    static async signOut(req, res, next) {
        try {
            const { id } = req.user;
            await session.remove(id);
            res.status(200).json({
                success: true,
                message: "sign out!"
            });
        } catch (error) {
            console.error(error)
            next(error);
        }
    }

    static async refreshToken(req, res, next) {
        try {
            const { refresh_token } = req.body;
            if (!refresh_token) throw new ResponseError(400, "Refresh token is required");

            const decoded = jwt.verifJwt(refresh_token);
            if (!decoded) throw new ResponseError(401, "Invalid refresh token");

            const userSession = await session.get(decoded.id);
            if (!userSession || userSession.refresh_token !== refresh_token) {
                throw new ResponseError(401, "Invalid refresh token");
            }

            if (new Date(userSession.expires_refresh_token) < new Date()) {
                await session.remove(decoded.id);
                throw new ResponseError(401, "Refresh token expired");
            }

            const { access_token: new_access_token, refresh_token: new_refresh_token } = await jwt.createToken({ id: decoded.id, email: decoded.email });
            await session.update(decoded.id, new_access_token, new_refresh_token);

            res.status(200).json({
                success: true,
                message: "Token refreshed successfully",
                data: {
                    access_token: new_access_token
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;