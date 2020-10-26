'use strict'

const { sequelize } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  var Menu = sequelize.define('Menu', {
    idEstablishment: DataTypes.INTEGER,
    products: DataTypes.JSON,
    name: DataTypes.STRING
  })
  return Menu;
}
