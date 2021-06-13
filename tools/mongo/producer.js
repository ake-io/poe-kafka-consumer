const {MongoClient} = require("mongodb")
// https://docs.mongodb.com/drivers/node/current/fundamentals/connection/

class ExpressAppMongo extends MongoClient {
    active = false;
    processing = false;
    mongo_db;

    async pingDB(){
        await this.db("admin").command({ ping: 1 });
        console.log("ExpressAppMongo: Pinged successfully to database");
    }
    async insert(data){
        var myobj = data;
        await this.db("poe-public-stash-items")
        .collection("stashes")
        .insertOne(myobj, function(err, res) { if (err) throw err;})
        // 
        //          dbo.collection("stashes").insertOne(myobj, function(err, res) {
        //               if (err) throw err;
        //             })
    }

    myEventHandlerActiveTrue = function (producer) {
        producer.wakeUp();
      }
    myEventHandlerActiveFalse = function (producer) {
        producer.sleep();
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
                this.close();
                console.log("ExpressAppMongo: Disconnected!")
            }
        } catch (error) {
            console.log(error)
            this.close();
            console.log("ExpressAppMongo: Disconnected!")
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