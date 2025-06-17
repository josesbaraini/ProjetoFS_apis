import express from "express";
import cors from "cors";
import userRotas from "./rotas/userRotas.js";
import admRotas from "./rotas/admRotas.js";
import treinosRotas from "./rotas/treinosRotas.js";
import passosRotas from "./rotas/passosRotas.js";
import notificacoesRotas from "./rotas/notificacoesRotas.js"
import eventosRotas from './rotas/eventosRotas.js'
import cookieParser from "cookie-parser";
const origemsPermitidas = ["https://mygym.dev.vilhena.ifro.edu.br","http://26.94.3.187:3000","http://10.82.3.236:3000","http://10.82.1.4:3000"]
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || origemsPermitidas.includes(origin)) {
          callback(null, origin);
        } else {
          callback(new Error('Origem não permitida pelo CORS'));
        }
      },
    credentials:true
}
const app = express();

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(cookieParser())
app.use(express.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
app.use("/api/user", userRotas);
app.use("/api/adm", admRotas);
app.use('/api/treinos', treinosRotas )
app.use('/api/passos', passosRotas )
app.use('/api/notificacoes', notificacoesRotas)
app.use('/api/eventos', eventosRotas)

const porta = 8000
app.listen(porta, ()=>{
    const data = new Date();
    console.log("Servidor node iniciado em: " + data)
    console.log('Servidor rodando na porta: '+porta)
})