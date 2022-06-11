import { Router } from "express";
import { login, register } from "../controllers/userController";
import { createEvent, getEventsList, deleteEvent, getEventById, updateEventById } from "../controllers/eventController";
import { uploadImage, deleteImage } from "../controllers/imageController";
import multer from "multer";
import authMiddleware from '../middleware/auth.guard'

const upload = multer({ storage: multer.memoryStorage() });

export const routes = Router();

//User routes
routes.post("/user/login", login);
routes.post("/user/register", register);

//Images routes
routes.post("/image/upload", authMiddleware, upload.single("image"), uploadImage);
routes.delete("/image/:hash", authMiddleware, deleteImage);

//Events routes
routes.get("/events/list", getEventsList);
routes.get("/events/:id", authMiddleware, getEventById)
routes.post("/events/create", authMiddleware, createEvent);
routes.put("/events/:id", authMiddleware, updateEventById)
routes.delete("/events/:id", authMiddleware, deleteEvent)
