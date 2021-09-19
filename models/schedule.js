'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class schedule extends Model {
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
    startTime: {
      type: DataTypes.TIME,
      get() {
        let tm = this.getDataValue('startTime');
        return tTrim(tm);
      }
    },
    endTime: {
      type: DataTypes.TIME,
      get() {
        let tm = this.getDataValue('endTime');
        return tTrim(tm);
      }
    },
    days: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'schedule',
  });
  return schedule;
};

function tTrim(tm) {
  if (!!!tm) return t;
  let t = tm.split(":");
  t.pop();
  return t.join(":")
}