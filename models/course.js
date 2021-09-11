'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      course.belongsTo(models.user.scope('minimum'), {
        foreignKey: 'hod',
        targetKey: 'uid',
        as: 'HOD'
      })
    }
  };
  course.init({
    uid: { type: DataTypes.STRING, unique: true, allowNull: false },
    title: DataTypes.STRING,
    hod: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'course',
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt', 'id'] }
    }
  });
  return course;
};