var Sequelize = require('sequelize');

var sequelize = new Sequelize('postgres://prello:prello@localhost:5432/prello');
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;