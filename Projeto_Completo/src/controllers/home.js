
// Importando as tabelas do DB
const sala = require('../model/sala');
const aluno = require('../model/aluno');

module.exports = {
    async pagInicialGet(req, res){
 
        const salas = await sala.findAll({
            raw: true,
            attributes: ['IDSala', 'Nome']
        });

        res.render('../views/index', {salas, alunos: '', id: {ID: 0, msg: 'Selecione uma sala.'}});
 
    },

    async pagInicialPost(req, res){
 
        const ID = req.body.nome;
     
        const salas = await sala.findAll({ raw: true, attributes: ['IDSala', 'Nome'] });
        

        let msg, alunos = '';
        if (ID == ""){
            msg = 'Selecione uma sala.';
        } else {

            alunos = await aluno.findAll({
                raw: true,
                attributes: ['IDAluno', 'Nome', 'Idade', 'Foto'],
                where: { IDSala: ID }
            });

            let capacidade = await sala.findByPk(ID, { raw: true, attributes: ['Capacidade'] });
            msg = `Essa sala possui ${capacidade.Capacidade - alunos.length} vagas disponíveis.`;
        }

        const id = { ID, msg };

        res.render('../views/index', {salas, alunos, id});
     
    }
}

