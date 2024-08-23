const sala = require('../model/sala')
const aluno = require('../model/aluno')

module.exports = {

    async pagInicialGet(req, res) {

        const salas = await sala.findAll({
            raw: true,
            attributes: ['IDSala', 'Nome']
        });

        const alunos = await aluno.findAll({
            raw: true,
            attributes: ['IDAluno', 'Nome', 'Idade', 'Foto']
        });

        res.render('../view/index', { salas, alunos, id: '', totalVagas: ''});
    },

    async pagInicialPost(req, res) {

        const id = req.body.nome;

        const alunos = await aluno.findAll({
            raw: true,
            attributes: ['IDAluno', 'Nome', 'Idade', 'Foto'],
            where: (id ? { IDSala: id } : {}) 
        });

        const salas = await sala.findAll({
            raw: true,
            attributes: ['IDSala', 'Nome']
        });


        const salaEsp = await sala.findByPk(id, {
            raw: true, //Retorna os somente os valores de uma tabela, sem os metadados
            attributes: ['Capacidade']
        });
        
        let totalVagas = 0;

        if (salaEsp) {
            
            totalVagas = salaEsp.Capacidade - alunos.length;
        }

        res.render('../view/index', { salas, alunos, id, totalVagas });
    }
}