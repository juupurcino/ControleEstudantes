const sala = require('../model/sala')
const aluno = require('../model/aluno')

module.exports = {
    
    async sala(req, res){
    res.render('../view/cadastroSala');
    },
    
    async salaInsert(req, res){
        const dados = req.body;

        await sala.create ({
            Nome: dados.nome,
            Capacidade: dados.capacidade
        });

        res.redirect('/');
    },

    async aluno(req, res){
        res.render('../view/cadastroAluno');
    },

    async alunoInsert(req, res){
        
        const dados = req.body;

        await aluno.create ({
            Nome: dados.nome,
            Idade: dados.idade,
            Sexo: dados.sexo,
            IDSala: dados.sala,
            Foto: dados.foto
        });

        res.redirect('/');
    },
    
    async aluno(req, res){
        // Encontrando todas as salas disponíveis no SQL
        const salas = await sala.findAll({
        raw: true, // Retorna somente os valores de uma tabela, sem os metadados.
        attributes: ['IDSala', 'Nome']
        });
        // Renderizando e passando o nome das salas para o front
        res.render('../view/cadastroAluno', {salas});
    }
}
