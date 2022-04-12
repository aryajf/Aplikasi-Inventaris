'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      History.belongsTo(models.Barang, {
        as: 'barang',
        foreignKey: 'barang_id'
      })
      History.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'user_id'
      })
    }
  };
  History.init({
    barang_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    tersedia: DataTypes.INTEGER,
    dipakai: DataTypes.INTEGER,
    rusak: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'History',
  });
  return History;
};