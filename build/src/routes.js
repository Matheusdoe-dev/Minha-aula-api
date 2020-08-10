"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// controllers
const ClassController_1 = __importDefault(require("./controllers/ClassController"));
// routes
const routes = express_1.default.Router();
// cadastro de aulas
routes.post("/classes", ClassController_1.default.create);
// listagem de aulas
routes.get("/classes", ClassController_1.default.index);
exports.default = routes;
