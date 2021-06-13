const { Kafka } = require("kafkajs")

class ExpressAppKafka extends Kafka {
    active = false;
    processing = false;
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
    async processData(data) {
        try {
            let that = this;
            that.processing = true;
            console.log("Doing Something")
        } catch (error) {
            console.log(error);
        }
        finally{
            this.processing = false;
        }
        
    }
 
}
module.exports = ExpressAppKafka