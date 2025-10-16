import { Router } from "express";
import PageController from "../controllers/PageController.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";

const IndexRoute = Router();

IndexRoute.get("/home", AuthMiddleware, PageController.homePage);
IndexRoute.get("/dashboard", AuthMiddleware, PageController.adminPage);

export default IndexRoute;