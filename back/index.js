import express from 'express';
import connectDB from './database/dbConfig.js';
import productRoutes from './routes/productRoutes.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//Initialisation de la connection à la db (MongoDB)
connectDB();

//Initialisation des routes
productRoutes(app);

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port : ${PORT}`);
});

export default app;