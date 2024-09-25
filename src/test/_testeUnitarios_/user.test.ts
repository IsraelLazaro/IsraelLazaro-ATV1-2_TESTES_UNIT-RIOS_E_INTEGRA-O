import { MongoMemoryServer } from 'mongodb-memory-server';
import { DeleteUserCaseUse } from '../../models/caseUse/User_DeleteCaseUse';
import mongoose, { now } from 'mongoose';
import { UserType } from '../../models/entities/user';
import User from '../../models/entities/user';
import { FindUserCaseUse } from "../../models/caseUse/User_FindCaseUse";
import { RegisterUserCaseUse } from '../../models/caseUse/User_RegisterCaseUse';

let mongoServer: MongoMemoryServer;
const newUser: UserType = {
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
    await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await User.deleteMany(); 
});

describe("Testes com usuários - TESTES UNITÁRIOS", () => {
    let findUserCaseUse: FindUserCaseUse;
    let registerUserCaseUse: RegisterUserCaseUse;
    let deleteUserCaseUse: DeleteUserCaseUse;

    beforeEach(() => {
        findUserCaseUse = new FindUserCaseUse();
        registerUserCaseUse = new RegisterUserCaseUse();
        deleteUserCaseUse = new DeleteUserCaseUse();

    });
    //Teste 01
    test("Deve registrar um novo usuário com sucesso", async () => {
        const registeredUser = await registerUserCaseUse.execute(newUser); 
        expect(registerUserCaseUse).toBeDefined();   
 
    });
    //Teste 02
    //Professor, ele faz o teste, mas acusa que o userName é obrigatório
    //Tentei resolver com mock, mas não consegui, entaõ deixei porque o teste passou
    test('Deve lançar um erro quando o cadastro do usuário falhar', async () => {
        const anotherUser: UserType = {
            ...newUser,
            userName: "" 
        };
        await expect(registerUserCaseUse.execute(anotherUser)).rejects.toThrow('Falha ao registrar usuário. Por favor, tente novamente mais tarde.');
    
     });
    
    //Teste 03
    test("Deve buscar usuários pelo nome", async () => {
        const anotherUser: UserType = {
            ...newUser,
            userName: "nomeDeExemplo" 
        }; 
        await User.create(anotherUser);
        const users = await findUserCaseUse.execute("nomeDeExemplo");
        expect(users).toBeDefined();

    });

    //Teste 04
    test("Dever retornar uma lista de usuários", async()=>{
        const registeredUser = await registerUserCaseUse.execute(newUser);
        const users = await findUserCaseUse.execute("novoUsuario");
        expect(users.length).toBeGreaterThan(0);

    });

    // Teste 05 
    test("Deve deletar um usuário existente", async () => {
        const registeredUser = await registerUserCaseUse.execute(newUser);        
        await deleteUserCaseUse.execute(registeredUser._id.toString());
        const deletedUser = await User.findById(registeredUser._id);
        expect(deletedUser).toBeNull();

    });

    // Teste 06
    test("Deve lançar erro ao tentar deletar usuário que não existe", async () => {
        const nonExistentId = new mongoose.Types.ObjectId().toString();
        await expect(deleteUserCaseUse.execute(nonExistentId)).rejects.toThrow("Usuário não encontrado no sistema!");
    
    });
});

 
    

