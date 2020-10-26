'use strict'

const { sequelize } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    phone: DataTypes.INTEGER,
    mobile: DataTypes.INTEGER
  })
  return User;
}