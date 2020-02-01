'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      usuario: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      senha: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      ultimo_login: {
        type: Sequelize.DATE,
        defaultValue: null,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      nome_completo: {
        type: Sequelize.STRING
      },
      cpf: {
        type: Sequelize.STRING
      },
      cep: {
        type: Sequelize.STRING,
      },
      logradouro: Sequelize.STRING,
      complemento: Sequelize.STRING,
      bairro: Sequelize.STRING,
      localidade: Sequelize.STRING,
      uf: Sequelize.STRING,
      unidade: Sequelize.STRING,
      cartao: Sequelize.STRING
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};