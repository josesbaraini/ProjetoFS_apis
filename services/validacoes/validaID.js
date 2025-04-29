export function validaParametroID(paramName = 'id'){
  return (req, res, next) =>  {
    const value = req.body[paramName];
  
  if (!/^\d+$/.test(value)) {
    return res.status(400).json({ error: `Paremetro ${paramName} inválido: deve ser um número inteiro positivo` });
  }

  req.body[paramName] = Number(value);
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