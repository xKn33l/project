const { sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
});

// We test the connection
sequelize.authenticate()
    .then(() => console.log('Database connected!'))
    .catch((err) => console.log('Error: ' + err));

MediaSourceHandle.exports = sequelize;