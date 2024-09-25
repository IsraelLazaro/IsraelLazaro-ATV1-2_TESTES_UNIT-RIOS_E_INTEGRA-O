import { Request, Response, NextFunction } from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import validateRegisterPet from '../../middlewares/pet_validateRegister';
import verifyExistsIdPet from '../../middlewares/pet_verifyExistsId';
import { RegisterPetCaseUse } from '../../models/caseUse/Pet_RegisterCaseUse';

let mongoServer: MongoMemoryServer;
const newPet = {
    name: 'Buddy',
    age: 5,
    specie: 'Dog',
    breed: 'Golden Retriever',
    weight: 30,
    size: 70,
    photos: ['photo1.jpg', 'photo2.jpg'],
}
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});
describe('validateRegisterPet Middleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    const registerPetUseCase = new RegisterPetCaseUse();
    beforeEach(() => {
        req = {
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });
    //Teste 01
    test('deve chamar next() se a validação passar', () => {
        req.body = {
            pets: [newPet],
        };

        validateRegisterPet(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
    //Teste 02
    test('deve retornar um erro se a idade for inválida', () => {
        const petTest = { ...newPet, age: -1 }; // Idade inválida
        req.body = {
            pets: [petTest],
        };

        validateRegisterPet(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: '"pets[0].age" must be greater than or equal to 0',
        });
    });
    //Teste 03
    test('deve retornar um erro se o nome estiver ausente', () => {
        const petTest = { ...newPet, name: undefined }; // Nome ausente
        req.body = {
            pets: [petTest],
        };
    
        validateRegisterPet(req as Request, res as Response, next);
    
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: '"pets[0].name" is required',
        });
    });
    //Teste 04
    test('deve retornar um erro se o peso não for um número', () => {
        const petTest = { ...newPet, weight: 'invalid' }; // Peso inválido
        req.body = {
            pets: [petTest],
        };

        validateRegisterPet(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: '"pets[0].weight" must be a number',
        });
    });
    //Teste 05
    test('deve retornar um erro se a espécie estiver ausente', () => {
        const petTest = { ...newPet, specie: undefined };
    
        req.body = {
            pets: [petTest],
        };
    
        validateRegisterPet(req as Request, res as Response, next);
    
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: '"pets[0].specie" is required',
        });
    });
    //Teste 06
    test('deve retornar um erro se o ID não estiver presente', async () => {
        req.params = {}; // Adiciona um objeto vazio para params
        await verifyExistsIdPet(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'ID Necessário para realizar a função desejada!',
        });
        expect(next).not.toHaveBeenCalled();
    });
    //Teste 07
    test('deve retornar um erro se um objeto em pets não tiver todos os campos obrigatórios', () => {
        const petTest = { age: 5, specie: 'Dog' }; // Falta o campo "name"
        
        req.body = {
            pets: [petTest],
        };
    
        validateRegisterPet(req as Request, res as Response, next);
    
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: '"pets[0].name" is required',
        });
    });
    
});