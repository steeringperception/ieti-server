'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class admission_no_index extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  admission_no_index.init({
    year: DataTypes.STRING,
    course: DataTypes.STRING,
    last_index: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'admission_no_index',
  });
  return admission_no_index;
};