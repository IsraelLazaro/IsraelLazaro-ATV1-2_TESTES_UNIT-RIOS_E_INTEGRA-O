import { Request, Response, NextFunction } from 'express';
import User, { UserType } from '../../models/entities/user';
import verifyExistsIdUser from '../../middlewares/user_verifyExistsId';
import validateRegisterUser from '../../middlewares/user_validateRegister';
import validateUpdateUser from '../../middlewares/user_validateUpdate';

jest.mock('../../models/entities/user');

const newUser: UserType = {
    userName: "novoUsuario",
    email: "novo@email.com",
    password: "senhaForte",
    cpf: "000.000.000-26",
    phone: "(11) 99999-9999",
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

const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockNext = jest.fn();

afterEach(() => {
    jest.clearAllMocks(); 
});

describe("Middleware: verifyExistsIdUser", () => {
    // Teste 01
    test("Deve retornar erro 400 quando ID não é fornecido", async () => {
        const req = { params: {} } as unknown as Request; 
        const res = mockResponse(); 
        await verifyExistsIdUser(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "ID é necessário para deletar o usuário." });
        expect(mockNext).not.toHaveBeenCalled();
    });

    // Teste 02
    test("Deve retornar erro 404 quando usuário não é encontrado", async () => {
        const fakeUserId = "fakeUserId";
        const req = { params: { id: fakeUserId } } as unknown as Request;
        const res = mockResponse();
        (User.findById as jest.Mock).mockResolvedValue(null);
        await verifyExistsIdUser(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Usuário não encontrado." });
        expect(mockNext).not.toHaveBeenCalled();
    });

    // Teste 03
    test("Deve chamar next() quando usuário é encontrado", async () => {
        const fakeUserId = "fakeUserId";
        const req = { params: { id: fakeUserId } } as unknown as Request;
        const res = mockResponse();
        (User.findById as jest.Mock).mockResolvedValue({ id: fakeUserId });
        await verifyExistsIdUser(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled(); 
        expect(res.status).not.toHaveBeenCalled();
    });
    // Teste 04
    test("Deve retornar erro 400 quando o email for inválido", async () => {
        const req = {
            body: { ...newUser, email: "emailincorreto" }
        } as Request;

        const res = mockResponse();

        await validateRegisterUser(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: '"email" must be a valid email' }); 
        expect(mockNext).not.toHaveBeenCalled(); 
    });
    // Teste 05
    test("Deve retornar erro 400 quando o nome de usuário é muito curto", async () => {
        const req = {
            body: { ...newUser, userName: "bil" } 
        } as Request;

        const res = mockResponse(); 

        await validateRegisterUser(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: '"userName" length must be at least 4 characters long' }); 
        expect(mockNext).not.toHaveBeenCalled(); 
    });
    // Teste 06
    test("Deve retornar erro 400 quando não é fornecido o campo de endereço", async () => {
        const req = {
            body: { ...newUser, address: undefined } 
        } as Request;

        const res = mockResponse();

        await validateRegisterUser(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: '"address" is required' }); 
        expect(mockNext).not.toHaveBeenCalled();
    });
    // Teste 07
    test("Deve retornar erro 400 quando a password é muito curta", async () => {
        const req = {
            body: { ...newUser, password: "123" } 
        } as Request;

        const res = mockResponse(); 

        await validateRegisterUser(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: '"password" length must be at least 6 characters long' });
    });
    // Teste 08 
    test("Deve retornar erro 400 quando o CPF é muito curto", async () => {
        const req = {
            body: { cpf: "000.000.00" }
        } as Request;
        const res = mockResponse();
        await validateUpdateUser(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: '"cpf" length must be 14 characters long' }); 
        expect(mockNext).not.toHaveBeenCalled();
    });
    // Teste 09
    test("Deve retornar erro 400 quando o telefone está em formato inválido", async () => {
        const req = {
            body: { phone: "123456789" } 
        } as Request;
        const res = mockResponse();
        await validateUpdateUser(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: '"phone" length must be 15 characters long' });
        expect(mockNext).not.toHaveBeenCalled();
    });

    // Teste 10 
    test("Deve retornar erro 400 quando o campo cidade está ausente", async () => {
        const req = {
            body: { address: { state: "SP" } } 
        } as Request;
        const res = mockResponse();
        await validateUpdateUser(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: '"address.city" is required' });
        expect(mockNext).not.toHaveBeenCalled();
    });

});
