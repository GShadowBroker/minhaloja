'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('products', 'discount', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: true
    })
      .catch(err => console.log(err));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('products', 'discount')
      .catch(err => console.log(err));
  }
};
