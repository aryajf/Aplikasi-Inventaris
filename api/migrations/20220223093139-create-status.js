'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Statuses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      location: {
        allowNull: false,
        type: Sequelize.ENUM('Dasar', 'Menengah', 'Lanjut'),
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('Tersedia', 'Dipakai', 'Rusak'),
      },
      stok: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      barang_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Statuses');
  }
};