/*
Программа device-workre.js, принимающая данные из очереди "device", обрабатывающая их
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
const DeviceModel = require("../models/device-model");


/*
Функция проверки  соединения с базой данных
*/
const cheak = async() => {
    try {
        await db.authenticate();    // Подключение к базе данных и отправка тестового запроса
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

cheak();    // Функция для проверки подключения к базе данных
/*
Функция для записи новых значений в таблицу "device"
Локальная переменные:
message
*/
const createMessage = async(message) => {
    const { device_vendor, device_product, device_version } = message;

    db.sync().then(function() {
        var deviceModel = DeviceModel.build({
            Device_vendor: device_vendor,
            Device_product: device_product,
            Device_version: device_version,
        });
        deviceModel.save();
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

        const QUEUE = "device";     // Подтверждение очереди
        channel.assertQueue(QUEUE);

        channel.consume(    // Получение сообщений
            QUEUE,
            (msg) => {
                console.log(chalk.white.bgMagenta.bold("Device received:----------"));
                const message = JSON.parse(msg.content.toString()); // Обработка сообщений
                createMessage(message);     // Запись сообщений в базу данных
                console.log("Данные успешно записаны в таблицу \"device\"");
                console.log(chalk.white.bgMagenta.bold("---------------------------"));
                console.log(`Было получено сообщение из очереди ${QUEUE}:`);
                console.dir(message);
                console.log(chalk.white.bgMagenta.bold("---------------------------"));
            }, {
                noAck: true,
            }
        );
    });
});