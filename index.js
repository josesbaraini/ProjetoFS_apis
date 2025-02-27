import express from "express";
import cors from "cors";
import userRotas from "./rotas/userRotas.js";
import admRotas from "./rotas/admRotas.js";

const app = express();

app.use(cors());
app.use(express.json())
app.use("/api/user", userRotas);
app.use("/api/adm", admRotas);

const porta = 8000
app.listen(porta, ()=>{
    const data = new Date();
    console.log("Servidor node iniciado em: " + data)
    console.log('Servidor rodando na porta: '+porta)
})