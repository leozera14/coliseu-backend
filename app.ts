import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { routes } from "./routes/routes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

app.listen(3333);

app.get("/", (req, res) => {
  res.json({ message: "Oi tetico" });
});
