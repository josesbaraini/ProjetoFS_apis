# ProjetoFS_apis

API RESTful criada com **Node.js**, **Express** e **MySQL**, com foco em autenticação e gerenciamento de usuários.

## 📚 Sobre o Projeto

Este projeto foi desenvolvido com fins educacionais, simulando a estrutura de um sistema back-end simples, com funcionalidades essenciais de autenticação e persistência de dados.

## 🧰 Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)
- [bcrypt](https://www.npmjs.com/package/bcrypt) – para hash de senhas
- [dotenv](https://www.npmjs.com/package/dotenv) – gerenciamento de variáveis de ambiente
- [cors](https://www.npmjs.com/package/cors)
- [mysql2](https://www.npmjs.com/package/mysql2)

## 📁 Estrutura do Projeto

```bash
ProjetoFS_apis/
├── controllers/
│   └── user.controller.js
├── routes/
│   └── auth.routes.js
├── services/
│   └── auth.service.js
├── validations/
│   └── user.validation.js
├── utils/
│   └── db.js
├── .env.example
├── app.js
└── package.json
🔐 Funcionalidades
Cadastro de usuários

Login com validação de credenciais

Conexão com banco de dados MySQL

Hash de senhas com bcrypt

Organização modular de código (controllers, routes, services)

🧑‍💻 Autor
Desenvolvido por José Sbaraini

📫 Entre em contato: josesbarainips@gmail.com
