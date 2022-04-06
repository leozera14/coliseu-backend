import { Router } from "express";
import { login, register } from "../controllers/userController";
import { createEvent } from "../controllers/eventController";
import { uploadImage } from "../controllers/imageController";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export const routes = Router();

//User routes
routes.post("/user/login", login);
routes.post("/user/register", register);

//Images routes
routes.post("/image", upload.single("image"), uploadImage);

//Events routes
routes.post("/events/create", createEvent);
