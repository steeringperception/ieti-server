'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class academic_year extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  academic_year.init({
    uid: DataTypes.STRING,
    title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'academic_year',
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt', 'id'] }
    }
  });
  return academic_year;
};