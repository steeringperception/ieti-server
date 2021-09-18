'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class practice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      practice.belongsTo(models.user.scope('minimum'), {
        foreignKey: 'teacher',
        targetKey: 'uid',
        as: 'Teacher'
      });
      practice.hasOne(models.submission, {
        foreignKey: 'practice_id',
        as: 'submission'
      });
      practice.hasMany(models.submission, {
        foreignKey: 'practice_id',
        as: 'Submissions'
      })
    }
  };
  practice.init({
    topic: DataTypes.STRING,
    subject: DataTypes.STRING,
    session: DataTypes.STRING,
    type: DataTypes.STRING,
    teacher: DataTypes.STRING,
    content: DataTypes.TEXT,
    attachments: DataTypes.JSON,
    lastDate: DataTypes.DATE,
    marks: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'practice',
  });
  return practice;
};