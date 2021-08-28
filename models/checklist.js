'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class checklist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  checklist.init({
    user_uid: DataTypes.STRING,
    checklist: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'checklist',
  });
  return checklist;
};