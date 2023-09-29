const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const InitializeService = require('../services/InitializeService');
const basename = path.basename(__filename);
require('dotenv').config();

const connection = {
  database: process.env.DATABASE_NAME,
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
  host: process.env.HOST,
  port: process.env.DBPORT,
  dialect: process.env.DIALECT,
  dialectmodel: process.env.DIALECTMODEL,
};

const sequelize = new Sequelize(connection);
const db = {};
db.sequelize = sequelize;

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

init();
module.exports = db;

async function init() {
  await db.sequelize.sync({ force: false });
  const initializeService = new InitializeService(db);
  initializeService.initiliaze();
}
