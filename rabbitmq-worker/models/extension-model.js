const sequelize = require('../db');
const {DataTypes} = require('sequelize');

// Представление таблиц как объектов, их дальнейшая инициализация и создание таковых, если они отсутствуют в базе данных

const extension = sequelize.define('extension', {
    id:{type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    dmac:{type: DataTypes.STRING},
    sPT:{type: DataTypes.STRING},
    request_URL:{type: DataTypes.STRING},
    file_path:{type: DataTypes.STRING},
    end_:{type: DataTypes.STRING},
    msg_:{type: DataTypes.STRING},
    type_:{type: DataTypes.STRING},
    Device_version:{type: DataTypes.STRING},
}, {
    timestamps: false
})

module.exports = extension;

// create TABLE extension(
//     id SERIAL PRIMARY KEY,
//     dmac VARCHAR(255),
//     sPT VARCHAR(255),
//     request_URL VARCHAR(255),
//     file_path VARCHAR(255),
//     end_ VARCHAR(255),
//     msg_ VARCHAR(255),
//     type_ VARCHAR(255),
//     Device_version VARCHAR(255),
// );
