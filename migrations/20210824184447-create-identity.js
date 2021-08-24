'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('identities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_uid: {
        type: Sequelize.STRING
      },
      id_no: {
        type: Sequelize.STRING
      },
      id_type: {
        type: Sequelize.STRING
      },
      issue_place: {
        type: Sequelize.STRING
      },
      issuer: {
        type: Sequelize.STRING
      },
      issue_date: {
        type: Sequelize.DATE
      },
      expiry_date: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('identities');
  }
};