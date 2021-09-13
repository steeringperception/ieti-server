'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class lecture extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      lecture.belongsTo(models.user.scope('minimum'), {
        foreignKey: 'teacher',
        targetKey: 'uid',
        as: 'Teacher'
      })
    }
  };
  lecture.init({
    topic: DataTypes.STRING,
    subject: DataTypes.STRING,
    session: DataTypes.STRING,
    link: DataTypes.STRING,
    type: DataTypes.STRING,
    teacher: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'lecture',
  });
  return lecture;
};