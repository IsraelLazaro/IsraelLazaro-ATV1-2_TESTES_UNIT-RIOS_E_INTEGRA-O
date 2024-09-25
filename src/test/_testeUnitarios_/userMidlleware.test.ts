import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest'; 
import express from 'express'; 
import User from '../../models/entities/user'; 
import { UserType } from '../../models/entities/user';
import verifyExistsIdUser from '../../middlewares/user_verifyExistsId'; 
import validateRegisterUser from '../../middlewares/user_validateRegister';
import validateUpdateUser from '../../middlewares/user_validateUpdate';

let mongoServer: MongoMemoryServer;
const newUser: UserType = {
    userName: "novoUsuario",
    email: "novo@email.com",
    password: "senhaForte",
    cpf:"000.000.000-26",
    phone:"(11) 99999-9999",
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

const app = express();
app.use(express.json());
app.delete('/users/:id', verifyExistsIdUser, (req, res) => {
    res.status(200).send(); 

});

app.post('/register', validateRegisterUser, async (req, res) => {
    try {
        const user = await User.create(req.body);
        return res.status(201).json(user);
    } catch (err:any) {
        return res.status(400).json({ message: err.message });
    };

});
app.post('/update/:id', validateUpdateUser, async (req, res)=>{
    try {
        const { id } = req.params; 
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true }); 
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(updatedUser);
    } catch (err: any) {
        return res.status(400).json({ message: err.message });
    }

})

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

describe("Testes para os middlewares de usuários", () => {
    // Teste 01
    test("Deve retornar erro 404 quando ID não existe", async () => {
        const noExistsId = new mongoose.Types.ObjectId().toString();
        const response = await request(app).delete(`/users/${noExistsId}`);
        expect(response.status).toBe(404);

    });

    // Teste 02
    test("Deve chamar next() quando ID existe", async () => {
        const createUser = await User.create(newUser);
        const response = await request(app).delete(`/users/${createUser._id}`);
        expect(response.status).toBe(200);

    });

    //Teste 03
    test("Deve retornar erro 400 quando o email for inválido", async () => {
        const userEmailInvalid = { ...newUser, email: "testeemailerrado" }; 
        const response = await request(app).post('/register').send(userEmailInvalid);
        expect(response.status).toBe(400);
        expect(response.body.message).toContain("email");

    });

    //Teste 04
    test("Deve retornar erro 400 quando o nome de usuário é muito curto", async () => {
        const nameUserShort = { ...newUser, userName: "bil" };
        const response = await request(app).post('/register').send(nameUserShort);
        expect(response.status).toBe(400);
        expect(response.body.message).toContain("userName"); 

    });

    //Teste 05
    test("Deve retornar erro 400 quando não é fornecido o campo de endereço", async () => {
        const noAddressUser = { userName: "novoUsuario", email: "novo@email.com", password: "senhaForte" }; 
        const response = await request(app).post('/register').send(noAddressUser);
        expect(response.status).toBe(400);
        expect(response.body.message).toContain("address"); 

    });

    //Teste 06
    test("Deve retornar erro 400 quando o password é muito curto", async () =>{
        const passwordUserShort = { ...newUser, password: "1234" };
        const response = await request(app).post('/register').send(passwordUserShort);
        expect(response.status).toBe(400);
        expect(response.body.message).toContain("password"); 
    });

    //Teste 07
    test("Deve retornar erro 400 o cpf é muito curto", async () =>{
        const createUser = await User.create(newUser);
        const cpfUserShort = {...createUser, cpf:"000.000.00"};
        const response = await request(app).post(`/update/${createUser._id}`).send(cpfUserShort);
        expect(response.status).toBe(400);
        expect(response.body.message).toContain("cpf");

    });

    //Teste 08 
    test("Deve retornar erro 400 quando o cpf é inválido", async () =>{
        const createUser = await User.create(newUser);
        const cpfUserInvalid = {...createUser, cpf:"000.000.000-CP"};
        const response = await request(app).post(`/update/${createUser._id}`).send(cpfUserInvalid);
        expect(response.status).toBe(400);
        expect(response.body.message).toContain("cpf");
    });

});
