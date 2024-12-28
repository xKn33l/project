const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Expense = sequelize.define('Expense', { 
    amount: { type: DataTypes.FLOAT, allowNull: false},
    category: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

module.exports = Expense;
