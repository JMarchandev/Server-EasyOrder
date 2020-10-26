'use strict'

const { sequelize } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  var Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    descrpition: DataTypes.STRING,
    mark: DataTypes.STRING,
    size: DataTypes.INTEGER,
    region: DataTypes.STRING,
    country: DataTypes.STRING,
    isAlcohol: DataTypes.BOOLEAN,
    category: DataTypes.STRING
  })  
  return Product;
}