'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('practices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      topic: {
        type: Sequelize.STRING
      },
      subject: {
        type: Sequelize.STRING
      },
      session: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      teacher: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.TEXT
      },
      attachments: {
        type: Sequelize.JSON
      },
      lastDate: {
        type: Sequelize.DATE
      },
      marks: {
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
    await queryInterface.dropTable('practices');
  }
};