'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class submission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      submission.belongsTo(models.user, {
        foreignKey: 'student_uid',
        targetKey: 'uid',
        as: 'student'
      });
      submission.belongsTo(models.practice, {
        foreignKey: 'practice_id',
        as: 'practice'
      })
    }
  };
  submission.init({
    practice_id: DataTypes.STRING,
    student_uid: DataTypes.STRING,
    description: DataTypes.STRING,
    attachment: DataTypes.STRING,
    marks: DataTypes.DECIMAL(5, 2),
    result: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'submission',
  });
  return submission;
};