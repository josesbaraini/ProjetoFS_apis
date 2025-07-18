import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRotas from "./routes/v1/userRotas.js";
import admRotas from "./routes/v1/admRotas.js";
import treinosRotas from "./routes/v1/treinosRotas.js";
import passosRotas from "./routes/v1/passosRotas.js";
import notificacoesRotas from "./routes/v1/notificacoesRotas.js";
import eventosRotas from './routes/v1/eventosRotas.js';

import UserRotasV2 from './routes/v2/userRoutesV2.js'
import enviarWhatsapp from "./services/zap/zap.js";

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

app.use("/api/v1/user", userRotas);
app.use("/api/v1/adm", admRotas);
app.use("/api/v1treinos", treinosRotas);
app.use("/api/v1/passos", passosRotas);
app.use("/api/v1/notificacoes", notificacoesRotas);
app.use("/api/v1/eventos", eventosRotas);

app.use("/api/v2/user", UserRotasV2 )

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

