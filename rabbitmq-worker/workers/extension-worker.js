/*
Программа extension-workre.js, принимающая данные из очереди "extension", обрабатывающая их
и записывающая их в базу данных
Используемые функции:
cheak - функция для проверки соединения с базой данных
createMessage - функция обрабатыващая принятый объект из очереди и записывающая данные из нее в базу данных
Используемые переменные:
QUEUE - содержит в себе строку зачения очереди;
message - объект, содержащий в себе данные принятые и расшифрованные из очереди.
*/
const amqp = require("amqplib/callback_api");
const chalk = require("chalk");
const db = require("../db");
const ExtensionModel = require("../models/extension-model");

const cheak = async() => {
    try {
        await db.authenticate();    // Подключение к базе данных и отправка тестового запроса
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

cheak(); // Функция для проверки подключения к базе данных

const createMessage = async(message) => {
    const {
        dmac,
        spt,
        request_url,
        file_path,
        end_,
        msg_,
        type_,
        device_version,
    } = message;
    db.sync().then(function() {
        try {
            var extensionModel = ExtensionModel.build({
            dmac: dmac,
            sPT: spt,
            request_URL: request_url,
            file_path: file_path,
            end_: end_,
            msg_: msg_,
            type_: type_,
            Device_version: device_version,
        });
        extensionModel.save();
        } catch (e) {
            console.log("Ошибка с записью данных в таблицу")
        }
    });
};

amqp.connect("amqp://localhost", (connError, connection) => {   // Подключение брокеру сообщений
    if (connError) {
        throw connError;
    }

    connection.createChannel((channelError, channel) => {  // Подключение к каналу связи
        if (channelError) {
            throw channelError;
        }

        const QUEUE = "extension";  // Подтверждение очереди
        channel.assertQueue(QUEUE);

        channel.consume(       // Получение сообщений
            QUEUE,
            (msg) => {
                console.log(chalk.white.bgYellow.bold("Extension received:----------"));
                const message = JSON.parse(msg.content.toString());         // Обработка сообщений
                createMessage(message); // Запись сообщений в базу данных
                console.log("Данные успешно записаны в таблицу \"extension\"");
                console.log(chalk.white.bgYellow.bold("---------------------------"));
                console.log(`Было получено сообщение из очереди ${QUEUE}:`);
                console.dir(message);
                console.log(chalk.white.bgYellow.bold("---------------------------"));
            }, {
                noAck: true,
            }
        );
    });
});