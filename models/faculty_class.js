'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class faculty_class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  faculty_class.init({
    faculty_uid: DataTypes.STRING,
    class_uid: DataTypes.STRING,
    isHod: DataTypes.BOOLEAN,
    session: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'faculty_class',
  });
  return faculty_class;
};