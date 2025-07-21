export default {
    table: "Passos",
    fields: {
        Treino_id: { type: "integer", required: true },
        nome: { type: "string", required: true },
        repeticoes: { type: "integer", required: true },
        peso: { type: "integer", required: true },
        series: { type: "integer", required: true }
    }
}; 