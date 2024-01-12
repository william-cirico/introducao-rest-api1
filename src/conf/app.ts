import express from "express";
import cors from "cors";
import rotasUsuario from "../rotas/usuario.rotas";
import rotasTarefa from "../rotas/tarefa.rotas";

// Criando a instância do express
const app = express();

// Configurando o CORS
// npm i cors
app.use(cors({
    origin: "*"
}));

// Adicionado o middleware para leitura do body
app.use(express.json());

// Adicionando as rotas
app.use(rotasUsuario);
app.use(rotasTarefa);

export default app;