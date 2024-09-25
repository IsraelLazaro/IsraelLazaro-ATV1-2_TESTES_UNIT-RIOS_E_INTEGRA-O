import { Router } from "express";
import { routerUser } from "./user.routes";
import { routerPets } from "./pets.routes";
import { routerRelations } from "./relations.routes";

const routes = Router();

routes.use(routerUser);
routes.use(routerPets);
routes.use(routerRelations);

export {routes};