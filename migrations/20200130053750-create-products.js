'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('products', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      image_path: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING
      },
      price_cents: {
        type: Sequelize.INTEGER
      },
      os: {
        type: Sequelize.STRING
      },
      color: {
        type: Sequelize.STRING
      },
      displaySize: {
        type: Sequelize.STRING
      },
      cpu: {
        type: Sequelize.STRING
      },
      ram: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('products');
  }
};