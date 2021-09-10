'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class faculty_class extends Model {
    static associate(models) {
    }
  };
  faculty_class.init({
    faculty_uid: DataTypes.STRING,
    course: DataTypes.STRING,
    semester: DataTypes.BOOLEAN,
    subject: DataTypes.BOOLEAN,
    session: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'faculty_class',
  });
  return faculty_class;
};