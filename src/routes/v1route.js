import { Router } from "express";
import AuthRoute from "./AuthRoute.js";
import IndexRoute from "./indexRoute.js";

const v1 = Router();

v1.use(AuthRoute);
// v1.use(IndexRoute);

export default v1;