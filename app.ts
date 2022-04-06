import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { routes } from "./routes/routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);

app.listen(8080);
