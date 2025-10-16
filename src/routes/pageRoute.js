
import { Router } from "express";
import FrondEndController from "../controllers/FrondEndController.js";
import pageAuthMiddleware from "../middleware/pageAuthMiddleware.js"; // We will create this next

const pageRoute = Router();

// Render pages
pageRoute.get("/login", FrondEndController.renderLoginPage);
pageRoute.get("/register", FrondEndController.renderRegisterPage);

// Handle form submissions
pageRoute.post("/register", FrondEndController.handleRegister);
pageRoute.post("/login", FrondEndController.handleLogin);

// Protected dashboard
pageRoute.get("/dashboard", pageAuthMiddleware, FrondEndController.renderDashboard);

// Handle logout
pageRoute.post("/logout", pageAuthMiddleware, FrondEndController.handleLogout);


export default pageRoute;
