'use strict';
module.exports = (sequelize, DataTypes) => {
  const manufacturers = sequelize.define('manufacturers', {
    name: {type: DataTypes.STRING, allowNull: false, unique: true}
  }, {});
  manufacturers.associate = function(models) {
    manufacturers.hasMany(models.products);
  };
  return manufacturers;
};