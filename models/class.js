'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class classs extends Model {

    static associate(models) {
      // define association here
    }
  };
  classs.init({
    uid: DataTypes.STRING,
    title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'class',
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt', 'id'] }
    }
  });
  return classs;
};