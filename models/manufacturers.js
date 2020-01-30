'use strict';
module.exports = (sequelize, DataTypes) => {
  const manufacturers = sequelize.define('manufacturers', {
    name: {type: DataTypes.STRING, allowNull: false}
  }, {});
  manufacturers.associate = function(models) {
    manufacturers.hasMany(models.products);
  };
  return manufacturers;
};