const sequelize = require('../db');
const {DataTypes} = require('sequelize');
// Представление таблиц как объектов, их дальнейшая инициализация и создание таковых, если они отсутствуют в базе данных
var device = sequelize.define('device', {
    id:{type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    Device_vendor: {type: DataTypes.STRING},
    Device_product: {type: DataTypes.STRING},
    Device_version: {type: DataTypes.STRING}
}, {
    timestamps: false
})

module.exports = device;

// create TABLE device(
//     deviceId SERIAL PRIMARY KEY,
//     Device_vendor VARCHAR(255),
//     Device_product VARCHAR(255),
//     Device_version VARCHAR(255)
// );