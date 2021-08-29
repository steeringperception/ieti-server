'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_meta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  user_meta.init({
    user_uid: DataTypes.STRING,
    keyword: DataTypes.STRING,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user_meta',
  });
  return user_meta;
};