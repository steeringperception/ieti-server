'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class results extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  results.init({
    topic: DataTypes.STRING,
    student: DataTypes.STRING,
    subject: DataTypes.STRING,
    semester: DataTypes.STRING,
    course: DataTypes.STRING,
    marks: DataTypes.DECIMAL,
    result: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'results',
  });
  return results;
};