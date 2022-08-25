/*
Программа message-workre.js, принимающая данные из очереди "message", обрабатывающая их
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
const MessageModel = require("../models/message-model");

const cheak = async() => {
    try {
        await db.authenticate();    // Подключение к базе данных и отправка тестового запроса
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

cheak();    // Функция для проверки подключения к базе данных

const createMessage = async(message) => {
    const { version_, signature_, severity, extensionId, deviceId, time } =
    message;

    db.sync().then(function() {
        var messageModel = MessageModel.build({
            version_: version_,
            signature_: signature_,
            severity: severity,
            extensionId: extensionId,
            deviceId: deviceId,
            time: time,
        });
        messageModel.save();
    });
};

amqp.connect("amqp://localhost", (connError, connection) => {   // Подключение брокеру сообщений
    if (connError) {
        throw connError;
    }

    connection.createChannel((channelError, channel) => {   // Подключение к каналу связи
        if (channelError) {
            throw channelError;
        }

        const QUEUE = "message";    // Подтверждение очереди
        channel.assertQueue(QUEUE);

        channel.consume(        // Получение сообщений
            QUEUE,
            (msg) => {
                console.log(chalk.white.bgBlue.bold("Message received:----------"));
                const message = JSON.parse(msg.content.toString()); // Обработка сообщений
                createMessage(message);     // Запись сообщений в базу данных
                console.log("Данные успешно записаны в таблицу \"message\"");
                console.log(chalk.white.bgBlue.bold("---------------------------"));
                console.log(`Было получено сообщение из очереди ${QUEUE}:`);
                console.dir(message);
                console.log(chalk.white.bgBlue.bold("---------------------------"));
            }, {
                noAck: true,
            }
        );
    });
});