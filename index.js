import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRotas from "./rotas/userRotas.js";
import admRotas from "./rotas/admRotas.js";
import treinosRotas from "./rotas/treinosRotas.js";
import passosRotas from "./rotas/passosRotas.js";
import notificacoesRotas from "./rotas/notificacoesRotas.js";
import eventosRotas from './rotas/eventosRotas.js';

import  enviarWhatsapp  from "./services/zap/zap.js"; // 👈 Importa a função

const app = express();

// Lista de domínios permitidos
const allowedOrigins = [
  'https://mygym.dev.vilhena.ifro.edu.br',
  'http://localhost:3000',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'A política de CORS para este site não permite acesso da sua origem.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use("/api/user", userRotas);
app.use("/api/adm", admRotas);
app.use("/api/treinos", treinosRotas);
app.use("/api/passos", passosRotas);
app.use("/api/notificacoes", notificacoesRotas);
app.use("/api/eventos", eventosRotas);

const porta = 8000;
app.listen(porta, () => {
  const data = new Date();
  console.log("Servidor node iniciado em: " + data);
  console.log('Servidor rodando na porta: ' + porta);
});

// 🚨 Captura de erros fatais
process.on('uncaughtException', async (err) => {
  console.error('[ERRO FATAL] uncaughtException:', err);
  await enviarWhatsapp(`⚠️ ERRO FATAL no servidor:\n${err.message}`);
  process.exit(1); // Finaliza para PM2 reiniciar (se estiver usando)
});

process.on('unhandledRejection', async (reason) => {
  console.error('[ERRO FATAL] unhandledRejection:', reason);
  await enviarWhatsapp(`⚠️ Falha não tratada:\n${reason}`);
  process.exit(1);
});

