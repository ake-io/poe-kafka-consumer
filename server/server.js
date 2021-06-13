const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const consumerRouter = require("../routes/consumer");
//const AppWatchDog = require("../tools/appWatchDog");
var events = require('events-async');
//const {myEventHandlerActiveFalse, myEventHandlerActiveTrue} = require('../tools/events');
const ExpressAppKafka = require("../tools/kafka/consumer");
const locals = require("../config/locals");

const app = express();
app.locals = locals;
//app.locals.appWatchDog = new AppWatchDog(app);
app.locals.consumer = new ExpressAppKafka({
    "clientId": app.locals.kafkaConsumerName,
    "brokers": app.locals.kafkaHost
});
app.locals.eventEmitter = new events.EventEmitter();
app.locals.eventEmitter.on('active-true', app.locals.consumer.myEventHandlerActiveTrue);
app.locals.eventEmitter.on('active-false', app.locals.consumer.myEventHandlerActiveFalse);


//console.log(app.locals);

const specs = swaggerJsDoc(app.locals.swaggerJsDocOptions);
app.use("/api", swaggerUI.serve, swaggerUI.setup(specs));
app.use(express.json());
app.use("/consumer", consumerRouter);
module.exports = app