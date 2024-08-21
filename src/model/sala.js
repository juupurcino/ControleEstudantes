const Sequelize = require('sequelize')
const database = require('../config/bd');

const sala = database.define('Salas', {

    IDSala: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    Nome: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    Capacidade: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = sala;

