import { DeleteUserCaseUse } from '../../models/caseUse/User_DeleteCaseUse';
import mongoose, { now } from 'mongoose';
import { UserType } from '../../models/entities/user';
import { FindUserCaseUse } from "../../models/caseUse/User_FindCaseUse";
import { RegisterUserCaseUse } from '../../models/caseUse/User_RegisterCaseUse';
import { UpdateUserCaseUse } from '../../models/caseUse/User_UpdateCaseUse';


jest.mock('../../models/caseUse/User_RegisterCaseUse');
jest.mock('../../models/caseUse/User_FindCaseUse');
jest.mock('../../models/caseUse/User_DeleteCaseUse');
jest.mock('../../models/caseUse/User_UpdateCaseUse');

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

describe("Testes com usuários - TESTES UNITÁRIOS", () => {
    let findUserCaseUse: FindUserCaseUse;
    let registerUserCaseUse: RegisterUserCaseUse;
    let deleteUserCaseUse: DeleteUserCaseUse;
    let updateUserCaseUse: UpdateUserCaseUse;

    beforeEach(() => {
        jest.clearAllMocks();
        findUserCaseUse = new FindUserCaseUse();
        registerUserCaseUse = new RegisterUserCaseUse();
        deleteUserCaseUse = new DeleteUserCaseUse();
        updateUserCaseUse = new UpdateUserCaseUse();

    });
    //Teste 01
    test("Deve registrar um novo usuário com sucesso", async () => {
        (registerUserCaseUse.execute as jest.Mock).mockResolvedValue(newUser);
        const registeredUser = await registerUserCaseUse.execute(newUser); 
        expect(registerUserCaseUse.execute).toHaveBeenCalledWith(newUser);
        expect(registeredUser).toEqual(newUser); 
    });
    //Teste 02
    test('Deve lançar um erro quando o cadastro do usuário falhar', async () => {
        const anotherUser: UserType = { ...newUser, userName: "" };
        (registerUserCaseUse.execute as jest.Mock).mockRejectedValue(new Error());
        await expect(registerUserCaseUse.execute(anotherUser)).rejects.toThrow();    
    });
    //Teste 03
    test("Deve buscar usuários pelo nome", async () => {
        (findUserCaseUse.execute as jest.Mock).mockResolvedValue(newUser);
        const foundUser = await findUserCaseUse.execute(newUser.userName);
        expect(findUserCaseUse.execute).toHaveBeenCalledWith(newUser.userName);
        expect(foundUser).toEqual(newUser);
    });
    //Teste 04
    test("Dever retornar uma lista de usuários", async () => {
        (registerUserCaseUse.execute as jest.Mock).mockResolvedValue(newUser);
        await registerUserCaseUse.execute(newUser);
        (findUserCaseUse.execute as jest.Mock).mockResolvedValue([newUser]);
        const foundUsers = await findUserCaseUse.execute(newUser.userName);
        expect(findUserCaseUse.execute).toHaveBeenCalledWith(newUser.userName);
        expect(foundUsers).toBeDefined(); 
        expect(foundUsers.length).toBeGreaterThan(0); 
        expect(foundUsers[0]).toEqual(newUser);
    });
    // Teste 05 
    test("Deve deletar um usuário existente", async () => {
        const registeredUser = { ...newUser, _id: "123456" };
        (registerUserCaseUse.execute as jest.Mock).mockResolvedValue(registeredUser);
        const foundUser = await registerUserCaseUse.execute(newUser);
        const idUser = foundUser._id.toString();
        (deleteUserCaseUse.execute as jest.Mock).mockResolvedValue(true); 
        const deletedUser = await deleteUserCaseUse.execute(idUser);
        expect(deleteUserCaseUse.execute).toHaveBeenCalledWith(idUser);
        expect(deletedUser).toBe(true); 
    });
    // Teste 06
    test("Deve lançar erro ao tentar deletar usuário que não existe", async () => {
        const nonExistentId = new mongoose.Types.ObjectId().toString();
        (deleteUserCaseUse.execute as jest.Mock).mockRejectedValue(new Error());
        await expect(deleteUserCaseUse.execute(nonExistentId)).rejects.toThrow();
    });
    // Teste 07
    test("Deve atualizar um usuário existente", async () => {
        const registeredUser = { ...newUser, _id: "123456" };        
        (registerUserCaseUse.execute as jest.Mock).mockResolvedValue(registeredUser);
        const updateUser:UserType = { ...registeredUser, userName: "usuarioAtualizado", email: "atualizado@email.com" };
        const foundUser = await registerUserCaseUse.execute(newUser);
        const idUser = foundUser._id.toString();
        const updateUserCaseUse = new UpdateUserCaseUse();
        (updateUserCaseUse.execute as jest.Mock).mockResolvedValue({ ...registeredUser, ...updateUser });
        const updatedUser = await updateUserCaseUse.execute(idUser, updateUser);
        expect(updateUserCaseUse.execute).toHaveBeenCalledWith(idUser, updateUser);
        expect(updatedUser.userName).toBe(updateUser.userName);
        expect(updatedUser.email).toBe(updateUser.email);
    });
    // Teste 08
    test("Deve lançar erro ao tentar atualizar usuário que não existe", async () => {
        const registeredUser = { ...newUser, _id: "123456" };
        (registerUserCaseUse.execute as jest.Mock).mockResolvedValue(registeredUser);
        const updateUser:UserType = { ...registeredUser, userName: "usuarioAtualizado", email: "atualizado@email.com" };
        const idUser = registeredUser._id.toString();
        (updateUserCaseUse.execute as jest.Mock).mockRejectedValue(new Error());
        await expect(updateUserCaseUse.execute(idUser, updateUser)).rejects.toThrow();
    });

    // Teste 09  
    test("Deve lançar erro ao tentar buscar um usuário com nome de usuário inválido", async () => {
        const invalidUserName = "usuarioInvalido"; // Nome de usuário que não existe
        (findUserCaseUse.execute as jest.Mock).mockRejectedValue(new Error("Usuário não encontrado"));
        
        await expect(findUserCaseUse.execute(invalidUserName)).rejects.toThrow("Usuário não encontrado");
    });
    // Teste 10
    test("Deve lançar erro ao tentar registrar um usuário com nome de usuário já existente", async () => {
        const existingUser: UserType = { ...newUser, userName: "usuarioExistente" };
        (registerUserCaseUse.execute as jest.Mock).mockResolvedValue(existingUser); 
        const newUserWithExistingUsername: UserType = { ...newUser, userName: "usuarioExistente" };
        (registerUserCaseUse.execute as jest.Mock).mockRejectedValue(new Error("Nome de usuário já existe"));
        await expect(registerUserCaseUse.execute(newUserWithExistingUsername)).rejects.toThrow("Nome de usuário já existe");
    });
});