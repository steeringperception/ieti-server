'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class education extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  education.init({
    user_uid: DataTypes.STRING,
    institute: DataTypes.STRING,
    place: DataTypes.STRING,
    academic_year: DataTypes.STRING,
    score: DataTypes.INTEGER,
    score_type: DataTypes.STRING,
    certificate: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'education',
  });
  return education;
};