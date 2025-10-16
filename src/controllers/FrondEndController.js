
import {ValidateSchema} from "../models/Validate.js";
import {LoginSchema, userSchema} from "../models/schema/userSchema.js";
import hashing from "../utils/hashing.js";
import {Db} from "../lib/prisma.js";
import ResponseError from "../Error/ResponseError.js";
import jwt from "../utils/jwt.js";
import session from "../utils/session.js";

class FrondEndController {
    static renderLoginPage(req, res) {
        res.render("login", { error: null });
    }

    static renderRegisterPage(req, res) {
        res.render("register", { error: null });
    }

    static async handleRegister(req, res, next) {
        try {
            const user = await ValidateSchema(userSchema, req.body);
            const existingUser = await Db.user.findUnique({ where: { email: user.email } });
            if (existingUser) {
                return res.status(400).render("register", { error: "Email already exists." });
            }
            user.password = await hashing.hashing(user.password);
            await Db.user.create({ data: user });
            res.redirect("/login");
        } catch (error) {
            res.status(400).render("register", { error: error.message || "Validation failed" });
        }
    }

    static async handleLogin(req, res, next) {
        try {
            const userData = await ValidateSchema(LoginSchema, req.body);
            const user = await Db.user.findUnique({
                where: { email: userData.email }
            });
            if (!user) {
                return res.status(401).render("login", { error: "Invalid email or password." });
            }
            const passwordVerify = await hashing.verify(userData.password, user.password);
            if (!passwordVerify) {
                return res.status(401).render("login", { error: "Invalid email or password." });
            }

            const { access_token, refresh_token } = await jwt.createToken({ id: user.id, email: user.email });
            await session.create(user.id, access_token, refresh_token);

            res.cookie('access_token', access_token, { httpOnly: true });
            res.cookie('refresh_token', refresh_token, { httpOnly: true });

            res.redirect("/dashboard");
        } catch (error) {
            res.status(401).render("login", { error: error.message || "An error occurred." });
        }
    }

    static renderDashboard(req, res) {
        res.render("dashboard", { user: req.user });
    }

    static async handleLogout(req, res, next) {
        try {
            // The user id should be attached by an auth middleware
            if (req.user && req.user.id) {
                await session.remove(req.user.id);
            }
            res.clearCookie('access_token');
            res.clearCookie('refresh_token');
            res.redirect('/login');
        } catch (error) {
            // Even if session removal fails, clear cookies and redirect
            res.clearCookie('access_token');
            res.clearCookie('refresh_token');
            res.redirect('/login');
        }
    }
}

export default FrondEndController;
