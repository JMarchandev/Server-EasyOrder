'use strict'

const { sequelize } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  var Establishment = sequelize.define('Establishment', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    town: DataTypes.STRING,
    zipCode: DataTypes.INTEGER,
    country: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.Establishment.belongsTo(models.User, {
          fereignKey: {
            allowNull: false
          }
        })
      }
    }
  })
  return Establishment;
}