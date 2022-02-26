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
      Barang.hasMany(models.Status, {
        as: 'status',
        foreignKey: 'barang_id'
      })
    }
  };
  Barang.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    slug: DataTypes.STRING,
    gambar: DataTypes.STRING,
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'Barang',
  });
  return Barang;
};