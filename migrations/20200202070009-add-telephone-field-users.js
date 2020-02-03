'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'telefone', {
        type: Sequelize.STRING
    })
      .catch(err => console.log(err));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', {
      telefone: {
        type: Sequelize.STRING
      }
    })
      .catch(err => console.log(err));
  }
};
