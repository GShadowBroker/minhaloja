'use strict';
module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define('products', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    name: {type: DataTypes.STRING, allowNull: false},
    image_path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price_cents: {type: DataTypes.INTEGER, allowNull: false},
    price: {
      type: DataTypes.VIRTUAL(DataTypes.DECIMAL(10,2), ['price_cents']),
      get: function(){
        return (this.get('price_cents') / 100).toFixed(2);
      }
    },
    os: DataTypes.STRING,
    color: DataTypes.STRING,
    displaySize: DataTypes.STRING,
    cpu: DataTypes.STRING,
    ram: DataTypes.STRING,
    url: {
      type: DataTypes.VIRTUAL,
      get: function(){
        return "/products/" + this.getDataValue('id');
      }
    }
  }, {});
  products.associate = function(models) {
    products.belongsTo(models.manufacturers);
  };
  return products;
};