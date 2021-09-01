'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uid: {
        unique: true,
        type: Sequelize.STRING
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      fatherName: {
        type: Sequelize.STRING
      },
      motherName: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      dob: {
        type: Sequelize.DATE,
        allowNull: false
      },
      alternateContact: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING, allowNull: false, unique: true
      },
      phone: {
        type: Sequelize.STRING, allowNull: false, unique: true
      },
      faxNo: {
        type: Sequelize.STRING, allowNull: false, unique: true
      },
      birthPlace: {
        type: Sequelize.STRING, allowNull: false, unique: true
      },
      postboxNo: {
        type: Sequelize.INTEGER, allowNull: false, unique: true
      },
      password: {
        type: Sequelize.STRING
      },
      lastLogin: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.INTEGER
      },
      role: {
        type: Sequelize.STRING, allowNull: false
      },
      picture: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      approvalDate: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};