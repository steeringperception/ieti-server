'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class semester extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      semester.belongsTo(models.course, {
        foreignKey: 'course',
        targetKey: 'uid',
        as: 'Course'
      })
    }
  };
  semester.init({
    uid: { type: DataTypes.STRING, unique: true, allowNull: false },
    title: DataTypes.STRING,
    course: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'semester',
  });
  return semester;
};