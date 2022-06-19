import { Router } from "express";
import { login, register } from "../controllers/userController";
import { createEvent, getEventsList, deleteEvent, getEventById, updateEventById } from "../controllers/eventController";
import {createEnvironment, getEnvironmentById, getEnvironmentsList, deleteEnvironment, updateEnvironmentById} from "../controllers/environmentController"
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
routes.get("/events/:id", getEventById)

routes.post("/events/create", createEvent);

routes.put("/events/:id", updateEventById)

routes.delete("/events/:id", deleteEvent)

//Environments routes
routes.get("/environments/list", getEnvironmentsList);
routes.get("/environments/:id", getEnvironmentById)

routes.post("/environments/create", createEnvironment);

routes.put("/environments/:id", updateEnvironmentById)

routes.delete("/environments/:id", deleteEnvironment)
