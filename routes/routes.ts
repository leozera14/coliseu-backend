import { Router } from "express";
import { login, register } from "../controllers/userController";

export const routes = Router();

routes.post("/login", login);
routes.post("/register", register);
