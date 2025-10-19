import express, { Router } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swagerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';
import v1 from './src/routes/v1route.js';
import ErrorMiddleware from './src/middleware/ErrorMiddleware.js';
import Logger from './src/utils/Logger.js';
import cookieParser from 'cookie-parser';
import pageRoute from './src/routes/pageRoute.js';
import { Db } from './src/lib/prisma.js';
import ResponseError from './src/Error/ResponseError.js';

// check connection db
Db.$connect().then((res) => {
}).catch(e => {
    throw new ResponseError(500, "database not connected")
}).finally(() => {
    Db.$disconnect()
})
 
// initialize app
const app = express();

// View Engine Setup
app.set('view engine', 'ejs');

// app.use(cors);
// app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data
app.use(cookieParser()); // For cookie parsing

// swagerUi ui 
const file = fs.readFileSync("./swager.yml", 'utf8');
const swagerDocs = YAML.parse(file);
app.use("/api-docs", swagerUi.serve, swagerUi.setup(swagerDocs));

// --- Routes ---
// Frontend Page Routes
app.use("/", pageRoute);
// API Routes
app.use("/api/v1", v1);


app.use(ErrorMiddleware);
const port = 3000;
app.listen(port, () => {
    Logger.info(`server running on port: ${port}`);
})