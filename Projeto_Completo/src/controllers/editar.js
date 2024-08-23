
// Importando as tabelas do DB
const sala = require('../model/sala');
const aluno = require('../model/aluno');
const { Sequelize } = require('sequelize');

// Importando FS
const fs = require('fs');


module.exports = {
    async alunos(req, res){
 
        // Recebendo o id da URL
        const parametro = req.params.id;
     
        const alunos = await aluno.findByPk(parametro, {
            raw: true, //Retorna os somente os valores de uma tabela, sem os metadados
            attributes: ['IDAluno', 'Nome', 'Idade', 'Sexo', 'Foto', 'IDSala']
        });
     

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
            if (salas[i].Capacidade!=0 || salas[i].IDSala==alunos.IDSala){
                listaSalas.push(salas[i]);
            }
        }
     
        res.render('../views/editarAluno', {listaSalas, alunos});
     
    },

    async adicionar(req, res){
 
        const dados = req.body;
        const id = req.params.id;

        // Excluindo aluno
        if (dados.envio == 'Excluir') {

            // Recebendo a antiga foto do aluno
            const antigaFoto = await aluno.findAll({
                raw: true,
                attributes: ['Foto'],
                where: { IDAluno: id }
            });
            if (antigaFoto[0].Foto != 'usuario.png') fs.unlink(`public/img/${antigaFoto[0].Foto}`, ( err => { if(err) console.log(err); } ));

            await aluno.destroy({ where: { IDAluno: id } });
            res.redirect('/');
            return;
        }

        // Se foi enviado alguma foto
        if (req.file) {
        
            // Recebendo a antiga foto do aluno
            const antigaFoto = await aluno.findAll({
                raw: true,
                attributes: ['Foto'],
                where: { IDAluno: id }
            });
        
            // Excluindo a foto da pasta
            if (antigaFoto[0].Foto != 'usuario.png') fs.unlink(`public/img/${antigaFoto[0].Foto}`, ( err => { if(err) console.log(err); } ));
        
            // Update da nova foto no DB
            await aluno.update(
                {Foto: req.file.filename},
                {where: { IDAluno: id }}
            );
            
        }

        // Dando upgrade nas novas informações
        await aluno.update({
            Nome: dados.nome,
            Idade: dados.idade,
            Sexo: dados.sexo,
            IDSala: dados.sala
        },
        {
            where: { IDAluno: id }
        });
     
        res.redirect('/');
    },

    async salas(req, res){

        // Recebendo o id da URL
        const parametro = req.params.id;
     
        if(parametro == 0) res.redirect('/');

        const salas = await sala.findByPk(parametro);

        res.render('../views/editarSala', {salas});
     
    },
    
    async salasUpdate(req, res){
 
        // Recebendo dados
        const id = req.params.id;
        const dados = req.body;

        // Excluindo aluno
        if (dados.envio == 'Excluir') {

            // Encontrando todas as salas disponíveis no SQL
            const alunos = await aluno.findAll({ raw: true, attributes: ['IDAluno', 'Foto'], where: { IDSala: id } });

            // Excluindo Alunos
            for (let i=0; i<alunos.length; i++) {
                const antigaFoto = await aluno.findAll({ raw: true, attributes: ['Foto'], where: { IDAluno: alunos[i].IDAluno } });
                if (antigaFoto[0].Foto != 'usuario.png') fs.unlink(`public/img/${antigaFoto[0].Foto}`, ( err => { if(err) console.log(err); } ));
                await aluno.destroy({ where: { IDAluno: alunos[i].IDAluno } });
            }

            await sala.destroy({ where: { IDSala: id } });

            res.redirect('/');
            return;
        }

        // Dando upgrade nas novas informações
        await sala.update({
            Nome: dados.nome,
            Capacidade: dados.capacidade
        },
        {
            where: { IDSala: id }
        });

        res.redirect('/');
     
    }

}