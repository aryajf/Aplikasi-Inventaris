'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  };
  User.init({
    email: DataTypes.STRING,
    nama: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    avatar: DataTypes.STRING,
    role: DataTypes.ENUM('Admin', 'Asisten'),
    token: DataTypes.STRING,
    token_expired_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};