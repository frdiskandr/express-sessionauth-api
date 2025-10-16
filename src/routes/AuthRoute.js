import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";

const AuthRoute = Router();

AuthRoute.post("/signUp", AuthController.signUp);
AuthRoute.post("/signIn", AuthController.signIn);
AuthRoute.delete("/signOut", AuthMiddleware, AuthController.signOut);
AuthRoute.post("/refresh-token", AuthController.refreshToken);

export default AuthRoute;