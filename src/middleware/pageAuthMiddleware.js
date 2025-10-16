
import jwt from "../utils/jwt.js";
import session from "../utils/session.js";
import {Db} from "../lib/prisma.js";

const pageAuthMiddleware = async (req, res, next) => {
    const { access_token, refresh_token } = req.cookies;

    if (!access_token) {
        return res.redirect("/login");
    }

    try {
        // 1. Verify Access Token
        const decoded_access = jwt.verifyToken(access_token);
        const db_session = await session.findByToken(access_token);

        if (!decoded_access || !db_session) {
            throw new Error("Invalid access token");
        }

        // 2. Check Access Token Expiry from DB
        if (new Date(db_session.expires_access_token) < new Date()) {
            throw new Error("Access token expired");
        }

        // 3. Attach user to request and proceed
        const user = await Db.user.findUnique({ where: { id: decoded_access.id } });
        if (!user) throw new Error("User not found");
        req.user = user;
        next();

    } catch (error) {
        // 4. Handle Expired or Invalid Access Token
        if (!refresh_token) {
            return res.redirect("/login");
        }

        try {
            const decoded_refresh = jwt.verifyToken(refresh_token);
            const db_session = await session.get(decoded_refresh.id);

            if (!decoded_refresh || !db_session || db_session.refresh_token !== refresh_token) {
                return res.redirect("/login");
            }

            // 5. Check Refresh Token Expiry
            if (new Date(db_session.expires_refresh_token) < new Date()) {
                await session.remove(decoded_refresh.id); // Clean up expired session
                return res.redirect("/login");
            }

            // 6. Issue new tokens
            const { access_token: new_access_token, refresh_token: new_refresh_token } = await jwt.createToken({ id: decoded_refresh.id, email: decoded_refresh.email });
            await session.update(decoded_refresh.id, new_access_token, new_refresh_token);

            // 7. Set new cookies and attach user to request
            res.cookie('access_token', new_access_token, { httpOnly: true });
            res.cookie('refresh_token', new_refresh_token, { httpOnly: true });

            const user = await Db.user.findUnique({ where: { id: decoded_refresh.id } });
            if (!user) return res.redirect("/login");
            req.user = user;
            
            // Redirect back to the originally requested dashboard page
            res.redirect(req.originalUrl);

        } catch (refreshError) {
            res.clearCookie('access_token');
            res.clearCookie('refresh_token');
            return res.redirect("/login");
        }
    }
};

export default pageAuthMiddleware;
