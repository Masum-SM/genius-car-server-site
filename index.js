const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;

const app = express()

const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


// mongodb database link for connecting server site (this is site) to mongodb database 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rhkgk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        //mondodb te carMechanic nam a akta database create hobe
        const database = client.db('carMechanic');
        // carMechanics db te data gula rakhar jonno akta collection lgbe.
        const servicesCollection = database.collection('services')


        // GET API 
        // database theke load korce data gula k. 
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({}) //db te servicesColleection joma hoicilo sekhan theke asche sonb gula.sog gula nile find ar moddhe empty object.            
            const services = await cursor.toArray() //jdata paice shegulak array conver korce.

            res.send(services) //full data k client site a pathaice
        })

        // GET SINGLE SERVICE 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const qurey = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(qurey)
            res.json(service)
        })
        // POST API 
        app.post('/services', async (req, res) => { // /services ar maddhome ai api ta k client site theke hit korbe. ai post method ta database a kaz korbe na jodi ui(client server)the hit na kora hoy.tai client server a post nite akhon kaz korte hobe.

            const service = req.body //client site ar information gula body a thake,sei information gula server site asche.
            console.log('hit the post api', service)




            const result = await servicesCollection.insertOne(service)
            console.log(result);

            res.json(result) //ai response ta client site jay.
        });

        // DELETE API 
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const qurey = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(qurey)
            res.json(result)
        })



    }
    finally {
        // await client.close()
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Runnint Genius Server')
})

app.listen(port, () => {
    console.log('Running Genius server on port : ', port);
})