'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      schedule.belongsTo(models.semester, {
        foreignKey: 'semester',
        targetKey: 'uid',
        as: 'Semester'
      });
      schedule.belongsTo(models.course, {
        foreignKey: 'course',
        targetKey: 'uid',
        as: 'Course'
      });
      schedule.belongsTo(models.user, {
        foreignKey: 'teacher',
        targetKey: 'uid',
        as: 'Teacher'
      });
      schedule.belongsTo(models.subject, {
        foreignKey: 'subject',
        targetKey: 'uid',
        as: 'Subject'
      });
    }
  };
  schedule.init({
    teacher: DataTypes.STRING,
    course: DataTypes.STRING,
    semester: DataTypes.STRING,
    subject: DataTypes.STRING,
    session: DataTypes.STRING,
    startTime: DataTypes.STRING,
    endTime: DataTypes.STRING,
    days: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'schedule',
  });
  return schedule;
};