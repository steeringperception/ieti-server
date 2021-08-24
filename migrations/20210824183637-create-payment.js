'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      admission_no: {
        type: Sequelize.STRING
      },
      total_amount: {
        type: Sequelize.INTEGER
      },
      paid_amount: {
        type: Sequelize.INTEGER
      },
      payment_mode: {
        type: Sequelize.STRING
      },
      payment_cause: {
        type: Sequelize.STRING
      },
      note: {
        type: Sequelize.STRING
      },
      academic_year: {
        type: Sequelize.STRING
      },
      accountant: {
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
    await queryInterface.dropTable('payments');
  }
};