'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class academicRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  academicRecord.init({
    user: DataTypes.STRING,
    class: DataTypes.STRING,
    session: DataTypes.STRING,
    hod: DataTypes.STRING,
    apply_as: DataTypes.STRING,
    study_mode: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    description: DataTypes.TEXT,
    year: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'academicRecord',
    tableName: 'academic_records',
  });
  return academicRecord;
};