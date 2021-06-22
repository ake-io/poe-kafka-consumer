const { Kafka } = require("kafkajs")

class ExpressAppKafka extends Kafka {
     constructor(KafkaConfig, locals){
         super(KafkaConfig);
         this.name = 'ExpressAppKafka';
         this.locals = locals
    }
    active = false;
    processing = false;
    locals = undefined;
    consumer = this.consumer({"groupId": "poe-kafka-consumer" }); //get App name from locals

    myEventHandlerActiveTrue = function (consumer) {
        consumer.wakeUp();
      }
    myEventHandlerActiveFalse = function (consumer) {
        consumer.sleep();
      }  
    
    async wakeUp() {
        try{
            if (!this.active){
                console.log("ExpressAppKafka: Ich wache auf");
                this.active = true;
                await this.consumer.connect();
                console.log("ExpressAppKafka: Connected!");
                await this.consumer.subscribe({
                    "topic": "Stashes",
                    "fromBeginning": true
                })
                await this.consumer.run({
                    "eachMessage": async result => {
                        console.log(`RVD Msg ${result.message.value} on partition ${result.partition}`)
                        this.locals.producer.insert({ message: result.message.value });

                    }
                })
            }
        } catch (error) {
            console.log(error)
        } finally {

        }
    }
    async sleep() {
        try{
            if(this.active){
                
                console.log("ExpressAppKafka: Ich lege mich schlafen")
                this.active = false;
                await this.consumer.disconnect();
                console.log("ExpressAppKafka: Disconnected!")
            }
        } catch (error) {
            console.log(error)
        } finally {

        }
    }
    getStatus() {
        return this.active;
    }
    async processData() {
        try {
            let that = this;
            that.processing = true;
            console.log("Doing Something");
            await this.consumer.run({
                "eachMessage": async result => {
                    console.log(`RVD Msg ${result.message.value} on partition ${result.partition}`)
                }
            })
        } catch (error) {
            console.log(error);
        }
        finally{
            this.processing = false;
        }
        
    }
 
}
module.exports = ExpressAppKafka