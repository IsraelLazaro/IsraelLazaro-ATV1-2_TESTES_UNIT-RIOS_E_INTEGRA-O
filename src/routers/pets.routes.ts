import { Router } from "express";

import { RegisterPetController } from "../controllers/pet_registerController";
import { FindOnePetController } from "../controllers/pet_findOneController";
import { DeletePetController } from "../controllers/pet_deleteController";
import { UpdatePetController } from "../controllers/pet_updateController";
import verifyExistsIdUser from "../middlewares/user_verifyExistsId";
import verifyExistsIdPet from "../middlewares/pet_verifyExistsId";
import { FindSimilarPetsController } from "../controllers/pet_findSimilarPetsController";

const routerPets = Router();

const registerPetController = new RegisterPetController();
const findOnePetController = new FindOnePetController();
const deletePetController = new DeletePetController();
const updatePetController = new UpdatePetController();
const findSimilarPetsController = new FindSimilarPetsController();

routerPets.get('/pets/:id', verifyExistsIdPet, findOnePetController.handle);
routerPets.post("/pets/:id", verifyExistsIdUser, registerPetController.handle);
routerPets.delete("/pets/delete/:id", verifyExistsIdPet, deletePetController.handle);
routerPets.put("/pets/update/:id", verifyExistsIdPet, updatePetController.handle);
routerPets.post('/pets/similar', findSimilarPetsController.handle);

export { routerPets };