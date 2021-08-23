'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class enquiry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  enquiry.init({
    uid: { type: DataTypes.STRING, unique: true, allowNull: false },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    fatherName: DataTypes.STRING,
    motherName: DataTypes.STRING,
    gender: DataTypes.STRING,
    dob: DataTypes.STRING,
    status: DataTypes.STRING,
    alternateContact: DataTypes.STRING,
    datadump: DataTypes.JSON,
    picture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'enquiry',
  });
  return enquiry;
};