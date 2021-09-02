'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_meta extends Model {
    static associate(models) {
      user_meta.hasOne(models.user.scope('minimum'), {
        foreignKey: 'uid',
        sourceKey: 'content',
        as: 'user'
      })
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