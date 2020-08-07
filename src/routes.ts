import express from "express";
// controllers
import ClassController from "./controllers/ClassController";
// routes
const routes = express.Router();

// cadastro de aulas
routes.post("/classes", ClassController.create);

// listagem de aulas
routes.get("/classes", ClassController.index);

export default routes;
