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
    discount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
      validate: {
        isNumeric: {
          msg: 'O valor do disconto deve ser numérico'
        },
        isInt: {
          msg: 'O valor do disconto deve ser um número inteiro'
        },
        min: 0,
        max: 100,
      }
    },
    price_cents: {type: DataTypes.INTEGER, allowNull: false},
    price: {
      type: DataTypes.VIRTUAL(DataTypes.DECIMAL(10,2), ['price_cents', 'discount']),
      get: function(){
        return parseFloat((this.get('price_cents')/100) * ((100 - this.get('discount')) / 100));
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
        return "/produtos/" + this.getDataValue('id');
      }
    }
  }, {});
  products.associate = function(models) {
    products.belongsTo(models.manufacturers);
  };
  return products;
};