/*
***************************************************************
Дипломный проект
Тема: «Разработка менеджера обмена сообщениями в распределительной системе»
Язык: Nodejs 14.17.0 LTS
Среда: PyCharm
Название программы: send.js
Разработал: Кулаков А.А.
Дата: 10.05.2021
****************************************************************
Задание:
Разработать программный интерфейс для системы обмена сообщениями в эмулированной высконагруженной
системе состоящей из нескольких сервисов.
*/
/*
Программа send.js, генерирующая данные, которые будут отправлены по
трем разным очередям для 3 других программ
Используемые переменные:
QUEUE - содержит в себе строку зачения очереди;
messageQueue - объект, содержащий в себе данные для отправки в очередь.
*/

const amqp = require("amqplib/callback_api");
const moment = require("moment");
const Chance = require("chance");
var randomMac = require("random-mac");

var chance = new Chance();

// Создание подключения к брокеру сообщений по протоколу AMQP
amqp.connect("amqp://localhost", (connError, connection) => {
  if (connError) {
    throw connError;
  }
  // Создание канала подключения
  connection.createChannel((channelError, channel) => {
    if (channelError) {
      throw channelError;
    }

    for (let i = 0; i < 122; i++) {
      setTimeout(() => {
        // Цикл будет иметь задержку в 1 секунду чтобы эмулировать нагрузку
        let QUEUE = "message";
        channel.assertQueue(QUEUE); // Подтверждение очереди
        const messageQueue = {
          // Создание объекта с данными для отправки

          id: i,
          version_: `${chance.integer({ min: 0, max: 20 })}.${chance.integer({
            min: 0,
            max: 20,
          })}.${chance.integer({ min: 0, max: 20 })}`,
          signature_: chance.hash({ length: 9 }),
          severity: chance.integer({ min: 0, max: 10 }),
          extensionId: chance.integer({ min: 0, max: 10 }),
          deviceId: chance.integer({ min: 0, max: 10 }),
          time: moment().format("YYYY MM HH:mm:ss"),
        };
        channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(messageQueue))); // Отправка данных в очередь
        console.log(`Сообщений отправлено в очередь ${QUEUE}:`);
        console.dir(messageQueue);

        QUEUE = "device";
        channel.assertQueue(QUEUE); // Подтверждение новой очереди
        const deviceQueue = {
          // Создание нового объекта с данными для отправки
          id: i,
          device_vendor: chance.word(),
          device_product: chance.word(),
          device_version: `${chance.integer({
            min: 0,
            max: 20,
          })}.${chance.integer({
            min: 0,
            max: 20,
          })}.${chance.integer({ min: 0, max: 20 })}`,
        };
        channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(deviceQueue))); // Отправка данных в очередь
        console.log(`Сообщений отправлено в очередь ${QUEUE}:`);
        console.dir(deviceQueue);

        QUEUE = "extension";
        channel.assertQueue(QUEUE); // Подтверждение третьей очереди
        const extensionQueue = {
          // Создание третьего объекта с данными
          id: i,
          dmac: `${randomMac()}`,
          spt: `${chance.integer({ min: 0, max: 2000000 })}`,
          request_url: `${chance.url({ domain: "www.socialradar.com" })}`,
          file_path: `${chance.url({ path: "images" })}`,
          end_: `${chance.date()}`,
          msg_: `${chance.sentence()}`,
          type_: `${chance.word({ length: 5 })}`,
          device_version: `${chance.integer({
            min: 0,
            max: 0,
          })}.${chance.integer({
            min: 0,
            max: 20,
          })}.${chance.integer({ min: 0, max: 20 })}`,
        };
        channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(extensionQueue))); // Отправка данных в 3 очередь
        console.log(`Сообщений отправлено в очередь ${QUEUE}:`);
        console.dir(extensionQueue);
      }, i * 1000 - i * i);
    }
  });
});
