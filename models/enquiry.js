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
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    gender: DataTypes.STRING,
    dob: DataTypes.STRING,
    status: DataTypes.STRING,
    course: DataTypes.STRING,
    degree: DataTypes.STRING,
    deletedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'enquiry',
    paranoid: true,
    defaultScope: {
      attributes: { exclude: ['updatedAt'] }
    }
  });
  return enquiry;
};