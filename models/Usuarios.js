export default {
  table: "Usuarios",
  fields: {
    nome:   { type: "string",  required: true },
    email:  { type: "string",  required: true },
    idade:  { type: "integer", required: false }
  }
};