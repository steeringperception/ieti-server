'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('courses', 'hod', {
        type: Sequelize.STRING,
        after: "title"
      }),
      queryInterface.addColumn('faculty_classes', 'course', {
        type: Sequelize.STRING,
        after: "faculty_uid"
      }),
      queryInterface.addColumn('faculty_classes', 'semester', {
        type: Sequelize.STRING,
        after: "faculty_uid"
      }),
      queryInterface.addColumn('faculty_classes', 'subject', {
        type: Sequelize.STRING,
        after: "faculty_uid"
      }),
      queryInterface.removeColumn('faculty_classes', 'isHod'),
      queryInterface.removeColumn('faculty_classes', 'class_uid')
    ])
  },
  down: async (queryInterface, Sequelize) => {
    // await queryInterface.dropTable('semesters');
  }
};