'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Status.belongsTo(models.Barang, {
        as: 'barang',
        foreignKey: 'barang_id'
      })
    }
  };
  Status.init({
    location: DataTypes.ENUM('Dasar', 'Menengah', 'Lanjut'),
    status: DataTypes.ENUM('Tersedia', 'Dipakai', 'Rusak'),
    stok: DataTypes.INTEGER,
    barang_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Status',
  });
  return Status;
};