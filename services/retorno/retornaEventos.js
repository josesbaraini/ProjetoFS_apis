import pool from "../conexao.js";
import  dayjs  from "dayjs";

export async function retornaEventosSemana(id) {

        const conexao = await pool.getConnection();
        const query = "SELECT * FROM Eventos WHERE Usuario_id = ? AND data BETWEEN ? AND ?";
      
        let dataAtual = dayjs()
        while (dataAtual.day()!=0) {
            dataAtual = dataAtual.subtract(1, 'day')
        }

        const dataInicial = dayjs().format(`YYYY-MM-${dataAtual.date()}`)
        const dataFinal = dayjs().format(`YYYY-MM-${dataAtual.date()+6}`)
    

        const resultado_query = await conexao.execute(query,[id,dataInicial,dataFinal]);
      
        const resposta = resultado_query[0];
      
        
        return resposta;
        
}
export async function retornaEventosMes(id, mes) {
    if (mes.length < 10) {
        mes = `0${mes}`
    }
        const conexao = await pool.getConnection();
        const query = "SELECT * FROM Eventos WHERE Usuario_id = ? AND data BETWEEN ? AND ?";
      
        const dataInicial = dayjs().format(`YYYY-${mes}-01`)
        const diaFinal = dayjs(`YYYY-${mes}-01`).endOf('month').date()
        const dataFinal = dayjs().format(`YYYY-${mes}-${diaFinal}`)
    

        const resultado_query = await conexao.execute(query,[id,dataInicial,dataFinal]);
      
        const resposta = resultado_query[0];
      
        
        return resposta;
        
    }
export async function retornaEventosId(id) {

    const query = "SELECT * FROM Eventos WHERE Usuario_id = ?";
    const resultado_query = await conexao.execute(query,[id]);
    const resposta = resultado_query[0];
    return resposta;
}