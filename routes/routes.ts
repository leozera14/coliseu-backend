import { Router } from "express";
import { login, register } from "../controllers/userController";
import { createEvent, getEventsList, deleteEvent } from "../controllers/eventController";
import { uploadImage, deleteImage } from "../controllers/imageController";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export const routes = Router();

//User routes
routes.post("/user/login", login);
routes.post("/user/register", register);

//Images routes
routes.post("/image/upload", upload.single("image"), uploadImage);
routes.delete("/image/:hash", deleteImage);

//Events routes
routes.get("/events/list", getEventsList);
routes.post("/events/create", createEvent);
routes.delete("/events/:id", deleteEvent)
