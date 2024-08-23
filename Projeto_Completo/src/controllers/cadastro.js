// Importando as tabelas do DB
const sala = require('../model/sala');
const aluno = require('../model/aluno');
const { Sequelize } = require('sequelize');
 
 
module.exports = {
    async sala(req, res){
        res.render('../views/cadastroSala');
    },
 
    async salaInsert(req, res){
 
        // Recebe as informações do front-end
        const dados = req.body;
 
        // Criando sala no banco de dados
        await sala.create({
            Nome: dados.nome,
            Capacidade: dados.capacidade
        });
 
        // Redirecionar para a página principal
        res.redirect('/');
 
    },

    async aluno(req, res){
 
        // Encontrando todas as salas disponíveis no SQL
        const salas = await sala.findAll({
            raw: true, // Retorna somente os valores de uma tabela, sem os metadados.
            attributes: ['IDSala', 'Nome', 'Capacidade']
        });

        // Quantidade de alunos em cada sala
        const quantAlunos = await aluno.findAll({
            raw: true,
            group: ['IDSala'],
            attributes: ['IDSala', [Sequelize.fn('count', Sequelize.col('IDSala')), 'Quant'] ]
        });

        // Ajustando a capacidade de novos alunos em cada sala
        let listaSalas = [];
        for (let i=0; i<salas.length; i++ ) {
            for (let j=0; j<quantAlunos.length; j++ ){
                if (salas[i].IDSala == quantAlunos[j].IDSala) {
                    salas[i].Capacidade -= quantAlunos[j].Quant;
                }
            }
            if (salas[i].Capacidade != 0){
                listaSalas.push(salas[i]);
            }
        }

        // Renderizando e passando o nome das salas para o front
        res.render('../views/cadastroAluno', {listaSalas});
     
    },

    async alunoInsert(req, res){
 
        // Recebendo as informações pelo Body
        const dados = req.body;
 
        // Nome padrão da foto
        let foto = 'usuario.png';
 
        // Verificando se foi enviada alguma foto
        if (req.file) {
            // Pegar novo nome da foto
            foto = req.file.filename;
        }

        // Criando aluno no banco de dados
        await aluno.create({
            Nome: dados.nome,
            Idade: dados.idade,
            Sexo: dados.sexo,
            IDSala: dados.sala,
            Foto: foto
        });
 
        // Redirecionar para a página principal
        res.redirect('/');

    }
}