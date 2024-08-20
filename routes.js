const express = require('express');
const route = express.Router();

const home = require('./src/controllers/home');
const cadastro = require('./src/controllers/cadastro');

route.get('/', home.pagInicialGet);
route.post('/', home.pagInicialPost);

route.get('/cadastroAluno', cadastro.aluno);
route.post('/cadastroAluno', cadastro.alunoInsert);

route.get('/cadastroSala', cadastro.sala);
route.post('/cadastroSala', cadastro.salaInsert); 

module.exports = route;
