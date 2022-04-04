import { Router } from "express";
import { login, register } from "../controllers/userController";
import { uploadImage } from "../controllers/eventController";

import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

export const routes = Router();

//User routes
routes.post("/user/login", login);
routes.post("/user/register", register);

//Events routes
routes.post("/events/create", upload.single("image"), uploadImage);
