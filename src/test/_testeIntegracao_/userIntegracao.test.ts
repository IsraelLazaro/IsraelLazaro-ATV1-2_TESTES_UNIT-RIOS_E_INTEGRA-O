
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import User, {UserType} from '../../models/entities/user';
import { RegisterUserCaseUse } from '../../models/caseUse/User_RegisterCaseUse';
import { UpdateUserCaseUse } from '../../models/caseUse/User_UpdateCaseUse';
import { LoginController } from '../../controllers/user_loginController';
import { DeleteUserCaseUse } from '../../models/caseUse/User_DeleteCaseUse';
import { Request, Response } from "express"; 

let mongoServer: MongoMemoryServer;
const newUser:UserType = {
    userName: "novoUsuario",
    email: "novo@email.com",
    password: "senhaForte",
    address: {
        city: "NovaCidade",
        state: "NovoEstado",
        location: {
            type: "Point",
            coordinates: [1, 1]
        }
    },
    role: "User",
    createdAt: new Date()
};

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await User.deleteMany(); 
});

describe('Testes de integração dos usuários', () => {
    //TESTE 01
    test('Deve registrar um novo usuário no banco de dados', async () => {
        const registerUser = new RegisterUserCaseUse();
        const createuser = newUser;
        
        const result = await registerUser.execute(createuser);

        expect(result).toBeDefined();
        expect(result.userName).toBe(newUser.userName);
        expect(result.email).toBe(newUser.email);
        expect(result.address.city).toBe(newUser.address.city);
    });
    //TESTE 02 
    test('Deve atualizar um usuário existente no banco de dados', async () => {
        const registerUser = new RegisterUserCaseUse();
        const updateUser = new UpdateUserCaseUse();
        const createdUser = await registerUser.execute(newUser);
        const updateData: UserType = {
            ...newUser,
            userName: "usuarioAtualizado",
            cpf:"000.000.000-00",
            phone:"(00) 00000-0000",
            name: "usuario",
        };
        const id = createdUser._id.toString();
        const updatedResult = await updateUser.execute(id, updateData);

        expect(updatedResult).toBeDefined();
        expect(updatedResult.userName).toBe(updateData.userName);
        expect(updatedResult.name).toBe(updateData.name);
        
        const userFromDB = await User.findById(createdUser._id);
        expect(userFromDB).toBeDefined();
        expect(userFromDB?.userName).toBe(updateData.userName);
        expect(userFromDB?.cpf).toBe(updateData.cpf);
        expect(userFromDB?.phone).toBe(updateData.phone);
    });
    //TESTE 03 
    test("Deve encotnrar um usuário criado no banco de dados", async () =>{
        const registerUser = new RegisterUserCaseUse();
        const createdUser = await registerUser.execute(newUser);
        const userDb = await User.findById(createdUser._id);

        expect(userDb).toBeDefined();
        expect(userDb?.userName).toBe(newUser.userName);
        expect(userDb?.email).toBe(newUser.email);
        expect(userDb?.address.city).toBe(newUser.address.city);
    });
    //TESTE 04
    test("Deve falhar na autenticação com senha incorreta", async () => {
        const registerUser = new RegisterUserCaseUse();
        await registerUser.execute(newUser);        
        const login = new LoginController();        
        const req = {
            body: {
                email: newUser.email,
                password: 'senhaErrada', 
            }
        } as Partial<Request>;    
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response; 

        await login.handle(req as Request, res);
    
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Senha incorreta!" });
    });

    // TESTE 05
    test("Deve excluir um usuário existente do banco de dados", async () => {
        const registerUser = new RegisterUserCaseUse();
        const createdUser = await registerUser.execute(newUser);
        
        const deleteUser = new DeleteUserCaseUse();
        await deleteUser.execute(createdUser._id.toString());
        
        const userFromDB = await User.findById(createdUser._id);
        expect(userFromDB).toBeNull(); 
    });


});
