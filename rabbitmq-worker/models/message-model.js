const sequelize = require('../db');
const {DataTypes} = require('sequelize');
// Представление таблиц как объектов, их дальнейшая инициализация и создание таковых, если они отсутствуют в базе данных

const message = sequelize.define('message_', {
    id:{type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    version_:{type: DataTypes.STRING},
    signature_:{type: DataTypes.STRING},
    severity:{type: DataTypes.INTEGER},
    extensionId: {type: DataTypes.INTEGER},
    deviceId: {type: DataTypes.INTEGER},
    time: {type: DataTypes.STRING}
}, {
    timestamps: false
})

module.exports = message;

// create TABLE message(
//     id SERIAL PRIMARY KEY,
//     version_ VARCHAR(255),
//     signature_ VARCHAR(255),
//     extensionId INTEGER,
//     deviceId INTEGER,
//     time VARCHAR(255)
// );