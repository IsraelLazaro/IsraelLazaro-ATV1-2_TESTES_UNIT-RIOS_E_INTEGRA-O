import { Router } from "express";
import { LikedPetController } from "../controllers/pet_likedController";
import { StatusCrossRequestController } from "../controllers/cross_statusRequestController";
import { CrossRequestController } from "../controllers/cross_requestController";

const routerRelations = Router();

const likedPetController = new LikedPetController();
const statusCrossRequestController = new StatusCrossRequestController();
const crossRequestController = new CrossRequestController();

routerRelations.post("/crossRequest/:id", crossRequestController.handle);
routerRelations.get("/statusCrossRequest", statusCrossRequestController.handle);
routerRelations.post("/liked", likedPetController.handle);


export {routerRelations};
