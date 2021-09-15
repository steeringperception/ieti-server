'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class subject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      subject.belongsTo(models.semester, {
        foreignKey: 'semester',
        targetKey: 'uid',
        as: 'Semester'
      });
      subject.belongsTo(models.course, {
        foreignKey: 'course',
        targetKey: 'uid',
        as: 'Course'
      });
      subject.belongsToMany(models.user, {
        foreignKey: 'subject',
        targetKey: 'uid',
        otherKey: 'teacher',
        sourceKey: 'uid',
        through: models.schedule,
        as: 'Teacher'
      })
    }
  };
  subject.init({
    uid: { type: DataTypes.STRING, unique: true, allowNull: false },
    title: DataTypes.STRING,
    course: DataTypes.STRING,
    semester: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'subject',
  });
  return subject;
};