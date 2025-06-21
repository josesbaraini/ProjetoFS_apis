import express from "express";
import cors from "cors";
import userRotas from "./rotas/userRotas.js";
import admRotas from "./rotas/admRotas.js";
import treinosRotas from "./rotas/treinosRotas.js";
import passosRotas from "./rotas/passosRotas.js";
import notificacoesRotas from "./rotas/notificacoesRotas.js"
import eventosRotas from './rotas/eventosRotas.js'
import cookieParser from "cookie-parser";

const app = express();

// Lista de domínios permitidos
const allowedOrigins = [
  'https://mygym.dev.vilhena.ifro.edu.br',
  'http://localhost:3000', // Para desenvolvimento local
  // Adicione outros domínios aqui se precisar
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem 'origin' (ex: Postman, apps mobile)
    if (!origin) return callback(null, true);

    // Se a origem estiver na lista, permite a requisição
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'A política de CORS para este site não permite acesso da sua origem.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(cookieParser())
app.use(express.json())
app.use("/api/user", userRotas);
app.use("/api/adm", admRotas);
app.use('/api/treinos', treinosRotas)
app.use('/api/passos', passosRotas)
app.use('/api/notificacoes', notificacoesRotas)
app.use('/api/eventos', eventosRotas)

const porta = 8000
app.listen(porta, () => {
  const data = new Date();
  console.log("Servidor node iniciado em: " + data)
  console.log('Servidor rodando na porta: ' + porta)
})