'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class experience extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  experience.init({
    user_uid: DataTypes.STRING,
    extra_curricular: DataTypes.TEXT,
    experiences: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'experience',
  });
  return experience;
};