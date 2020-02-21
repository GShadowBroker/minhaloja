'use strict';

const dotenv = require('dotenv').config({path:'../.env'});
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db = {};

const credentials = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: "127.0.0.1",
    dialect: "postgres"
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: "127.0.0.1",
    dialect: "postgres"
  },
  production: {
    dialect: "postgres",
    use_env_variable: "DATABASE_URL"
  }
};

if (process.env.NODE_ENV !== 'production'){
  var config = credentials.development;
} else {
  var config = credentials.production;
}

console.log(`WE ARE IN ${process.env.NODE_ENV} mode!\config: ${config}\nconfig.use_env_variable: ${config.use_env_variable}`);

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// if (process.env.NODE_ENV !== 'production') {
  
//   let dotenv = require('dotenv').config({path:'../.env'});

//   let DATABASE_URL = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@localhost:5432/${process.env.DB_NAME}`;

//   var sequelize = new Sequelize(DATABASE_URL);

// } else {

//   var sequelize = new Sequelize(process.env.DATABASE_URL);

// }

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
