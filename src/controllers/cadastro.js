const sala = require('../model/sala')

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
    }
}
