'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class identity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  identity.init({
    user_uid: DataTypes.STRING,
    id_no: DataTypes.STRING,
    id_type: DataTypes.STRING,
    issue_place: DataTypes.STRING,
    issuer: DataTypes.STRING,
    issue_date: DataTypes.DATE,
    expiry_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'identity',
  });
  return identity;
};