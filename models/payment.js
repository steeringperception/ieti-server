'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  payment.init({
    admission_no: DataTypes.STRING,
    total_amount: DataTypes.INTEGER,
    paid_amount: DataTypes.INTEGER,
    payment_mode: DataTypes.STRING,
    payment_cause: DataTypes.STRING,
    note: DataTypes.STRING,
    academic_year: DataTypes.STRING,
    accountant: DataTypes.STRING,
    invoice: DataTypes.TEXT,
    invoice_no: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'payment',
  });
  return payment;
};