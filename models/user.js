'use strict';
const {
  Model
} = require('sequelize');
var base = require('base-converter');

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.addHook('beforeCreate', (inst) => {
        if (!!!inst.userId) {
          inst.userId = base.decTo62(Date.now());
        }
      });
      this.hasOne(models.academicRecord, {
        foreignKey: 'user',
        sourceKey: 'uid',
        as: "academicRecord"
      });
      this.hasOne(models.address, {
        foreignKey: 'user_uid',
        sourceKey: 'uid',
        as: "address"
      });
      this.hasMany(models.education, {
        sourceKey: 'uid',
        foreignKey: 'user_uid',
        as: "education"
      });
      this.hasMany(models.identity, {
        foreignKey: 'user_uid',
        sourceKey: 'uid',
        as: "identity"
      });
      this.hasOne(models.emergency_contacts, {
        foreignKey: 'user_uid',
        sourceKey: 'uid',
        as: "emergency_contact"
      });
      this.hasOne(models.checklist, {
        foreignKey: 'user_uid',
        sourceKey: 'uid',
        as: "checklist"
      });
      this.hasOne(models.experience, {
        foreignKey: 'user_uid',
        sourceKey: 'uid',
        as: "experience"
      });
      this.hasMany(models.payment, {
        foreignKey: 'admission_no',
        sourceKey: 'uid',
        as: "payments"
      });
      this.hasOne(models.payment, {
        foreignKey: 'admission_no',
        sourceKey: 'uid',
        as: "payment"
      });
      this.hasMany(models.user_meta, {
        foreignKey: 'user_uid',
        sourceKey: 'uid',
        as: "user_meta"
      });
      this.hasMany(models.document, {
        foreignKey: 'user_uid',
        sourceKey: 'uid',
        as: "documents"
      });
      this.hasOne(models.user_meta, {
        foreignKey: 'user_uid',
        sourceKey: 'uid',
        as: "userMeta"
      });
    }
  };
  user.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    uid: { type: DataTypes.STRING, unique: true, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING },
    fatherName: { type: DataTypes.STRING },
    motherName: { type: DataTypes.STRING },
    gender: { type: DataTypes.STRING, allowNull: false },
    dob: { type: DataTypes.DATE, allowNull: false },
    alternateContact: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: { msg: "Email is invalid" } }, unique: true },
    phone: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, allowNull: false },
    lastLogin: { type: DataTypes.DATE },
    status: { type: DataTypes.INTEGER },
    picture: { type: DataTypes.STRING },
    faxNo: { type: DataTypes.STRING },
    postboxNo: { type: DataTypes.INTEGER },
    birthPlace: { type: DataTypes.STRING },
    approvalDate: { type: DataTypes.DATE },
  }, {
    sequelize,
    modelName: 'user',
    defaultScope: {
      attributes: { exclude: ['updatedAt', 'password', 'id'] }
    },
    scopes: {
      profile: {
        attributes: { exclude: ['createdAt', 'updatedAt', 'password', 'id'] },
        // include: ['address', 'course']
      }
    }
  });
  return user;
};
