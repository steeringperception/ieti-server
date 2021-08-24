'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class emergency_contacts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  emergency_contacts.init({
    user_uid: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    mobile: DataTypes.INTEGER,
    telephone: DataTypes.STRING,
    email: DataTypes.STRING,
    relation: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'emergency_contacts',
  });
  return emergency_contacts;
};