'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class material extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      material.hasMany(models.material, {
        foreignKey: 'parent',
        as: 'children'
      })
    }
  };
  material.init({
    topic: DataTypes.STRING,
    subject: DataTypes.STRING,
    session: DataTypes.STRING,
    course: DataTypes.STRING,
    teacher: DataTypes.STRING,
    content: DataTypes.TEXT,
    attachments: DataTypes.JSON,
    lastDate: DataTypes.DATE,
    parent: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'material',
    defaultScope: {
    },
    scopes: {
      tree: {
        attributes: ['id', 'topic', 'parent', 'subject'],
        include: ['children']
      },
    }
  });
  return material;
};