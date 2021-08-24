'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('education', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_uid: {
        type: Sequelize.STRING
      },
      institute: {
        type: Sequelize.STRING
      },
      place: {
        type: Sequelize.STRING
      },
      academic_year: {
        type: Sequelize.STRING
      },
      score: {
        type: Sequelize.INTEGER
      },
      score_type: {
        type: Sequelize.STRING
      },
      certificate: {
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
    await queryInterface.dropTable('education');
  }
};