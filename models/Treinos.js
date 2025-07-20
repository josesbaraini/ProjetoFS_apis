export default {
    table: "Treinos",
    fields: {
        usuario_id: { type: "integer", required: true },
        nome: { type: "string", required: true },
        descricao: { type: "string", required: false },
        data_treino: { type: "date", required: true },
        repetir: { type: "boolean", required: false }
    }
}; 