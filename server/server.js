const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const consumerRouter = require("../routes/consumer");
var events = require('events-async');
const ExpressAppKafka = require("../tools/kafka/consumer");
const ExpressAppMongo = require("../tools/mongo/producer");
const locals = require("../config/locals");

const app = express();
app.locals = locals;
app.locals.consumer = new ExpressAppKafka({
    "clientId": app.locals.kafkaConsumerName,
    "brokers": app.locals.kafkaHost
},app.locals);
app.locals.producer = new ExpressAppMongo(locals.mongoUrl);
app.locals.eventEmitter = new events.EventEmitter();
app.locals.eventEmitter.on('kafka-active-true', app.locals.consumer.myEventHandlerActiveTrue);
app.locals.eventEmitter.on('kafka-active-false', app.locals.consumer.myEventHandlerActiveFalse);
app.locals.eventEmitter.on('mongo-active-true', app.locals.producer.myEventHandlerActiveTrue);
app.locals.eventEmitter.on('mongo-active-false', app.locals.producer.myEventHandlerActiveFalse);

//console.log(app.locals);

const specs = swaggerJsDoc(app.locals.swaggerJsDocOptions);
app.use("/api", swaggerUI.serve, swaggerUI.setup(specs));
app.use(express.json());
app.use("/consumer", consumerRouter);
module.exports = app