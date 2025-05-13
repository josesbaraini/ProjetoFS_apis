import { retornaUsuarioId } from "../retorno/retornaUsuarios.js";

export function validaParametroID(paramName = 'id'){
  return async (req, res, next) =>  {
    const value = req.params[paramName];
  
  if (!/^\d+$/.test(value)) {
    return res.status(400).json({ error: `Paremetro ${paramName} inválido: deve ser um número inteiro positivo` });
  }
  

  req.params[paramName] = Number(value);
  if (paramName == "id") {
    const result  = await retornaUsuarioId(req.params[paramName])
    if (result.length < 1) {
      return res.status(400).json({ error: `Id de Usuario não encontrado no sistema` });
    }
  }

  next();}
}

export function validaBodyID(paramName = 'id'){
  return (req, res, next) =>  {
    const value = req.body[paramName];
  
  if (!/^\d+$/.test(value)) {
    return res.status(400).json({ error: `Paremetro ${paramName} inválido: deve ser um número inteiro positivo` });
  }

  req.body[paramName] = Number(value);
  next();}
}