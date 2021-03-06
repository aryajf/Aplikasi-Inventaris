'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Barang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Barang.belongsTo(models.Category, {
        as: 'category',
        foreignKey: 'category_id'
      })
      Barang.hasMany(models.History, {
        as: 'histories',
        foreignKey: 'barang_id'
      })
    }
  };
  Barang.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    gambar: DataTypes.STRING,
    tersedia: DataTypes.INTEGER,
    dipakai: DataTypes.INTEGER,
    rusak: DataTypes.INTEGER,
    type: DataTypes.ENUM('Dasar', 'Menengah', 'Lanjut'),
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'Barang',
  });
  return Barang;
};