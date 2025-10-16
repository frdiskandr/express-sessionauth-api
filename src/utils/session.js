import {Db} from "../lib/prisma.js";
import {v1} from "uuid"

class session {
    static async create(id) {
        const access_token = v1();
        const refresh_token = v1();
        const expires_access_token = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1 day
        const expires_refresh_token = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days
        const result = await Db.session.create({
            data: {
                user_id: id,
                access_token: access_token,
                refresh_token: refresh_token,
                expires_access_token: expires_access_token.toISOString(),
                expires_refresh_token: expires_refresh_token.toISOString()
            }
        });
        return result;
    }

    static async get(id) {
        const result = await Db.session.findFirst({
            where: {
                user_id: id
            }
        });
        return result;
    }

    static async findByToken(access_token) {
        const result = await Db.session.findFirst({
            where: {
                access_token: access_token
            }
        });
        return result;
    }

    static async update(id, new_access_token, new_refresh_token) {
        const expires_access_token = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1 day
        const expires_refresh_token = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days
        const result = await Db.session.updateMany({
            where: {
                user_id: id
            },
            data: {
                access_token: new_access_token,
                refresh_token: new_refresh_token,
                expires_access_token: expires_access_token.toISOString(),
                expires_refresh_token: expires_refresh_token.toISOString()
            }
        });
        return result;
    }

    static async remove(id) {
        // It's possible a user might not have a session, so we use deleteMany which doesn't fail if no record is found.
        const result = await Db.session.deleteMany({
            where: {
                user_id: id
            }
        });
        return result;
    }
}

export default session;