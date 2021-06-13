const {MongoClient} = require("mongodb")
// https://docs.mongodb.com/drivers/node/current/fundamentals/connection/

class ExpressAppMongo extends MongoClient {
    active = false;
    processing = false;
    mongo_db;

    myEventHandlerActiveTrue = function (producer) {
        producer.wakeUp();
      }
    myEventHandlerActiveFalse = function (producer) {
        producer.sleep();
      }  
    
    setDatabase(err,db,a) {
        if(err) throw err;
        console.log(a);
        //this.mongo_db = db;    
    }
    
    async wakeUp() {
        try{
            if (!this.active){
                console.log("ExpressAppMongo: Ich wache auf");
                this.active = true;
                await this.connect();
                console.log("ExpressAppMongo: Connected!");
                await this.db("admin").command({ ping: 1 });
                console.log("Connected successfully to database");
            }
        } catch (error) {
            console.log(error)
            await this.close();
        } finally {

        }
    }
    async sleep() {
        try{
            if(this.active){
                console.log("ExpressAppMongo: Ich lege mich schlafen")
                this.active = false;
                
            }
        } catch (error) {
            console.log(error)

        } finally {
            this.close();
            console.log("ExpressAppMongo: Disconnected!")
        }
    }
    getStatus() {
        return this.active;
    }
    async processData(data) {
        try {
            let that = this;
            that.processing = true;
            console.log("ExpressAppMongo: Doing Something")
        } catch (error) {
            console.log(error);
        }
        finally{
            this.processing = false;
        }
        
    }
 
}
module.exports = ExpressAppMongo