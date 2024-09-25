import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

async function main() {
    try {
        await mongoose.connect(process.env.DB_MONGO_URI as string); 
          console.log("Conectado com sucesso!!");
    } catch (err) {
        console.error("Erro ao conectar ao MongoDB:", err);
    };
};

main();

export default mongoose;
