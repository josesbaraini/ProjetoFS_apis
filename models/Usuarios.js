export default {
  table: "Usuarios",
  fields: {
    id: { type: "integer", required: true , default:true  },
    nome: { type: "string", required: true },
    email: { type: "string", required: true },
    telefone: { type: "string", required: false },
    senha: { type: "string", required: true },
    created_at: { type: "datetime", required: false, default:true  },
    data_nascimento: { type: "date", required: false },
    role: { type: "string", required: false, default:true  },
    fotoPerfil: { type: "string", required: false },
    last_check: { type: "datetime", required: false, default:true }
  }
};