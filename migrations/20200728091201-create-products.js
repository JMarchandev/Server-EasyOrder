'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING
      },
      mark: {
        allowNull: true,
        type: Sequelize.STRING
      },
      size: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      region: {
        allowNull: true,
        type: Sequelize.STRING
      },
      country: {
        allowNull: true,
        type: Sequelize.STRING
      },
      isAlcohol: {
        allowNull: true,
        type: Sequelize.BOOLEAN
      },
      category: {
        allowNull: false,
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Products');
  }
};