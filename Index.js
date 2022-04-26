const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors')
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());

// dataBase connected
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4jfbz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//database async function run 
async function run (){
    try{
        await client.connect();

        const serviceCollection = client.db('car').collection('service')
        
        app.get('/service',async (req,res)=>{

        const query = {};
        const cursor = serviceCollection.find(query);
        const service = await cursor.toArray();
            res.send(service)
        });

        // load a single service in ui 
        app.get('/service/:id', async ( req,res) =>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const service = await serviceCollection.findOne(query);
            res.send(service)
        })
        
        app.post('/service',async(req,res)=>{
            const newService = req.body
            const result = await serviceCollection.insertOne(newService)
            res.send(result);

        })


        app.delete('/service/:id', async (req,res)=>{
            const id =req.params.id
            const query = { _id: ObjectId(id)}

            const result = await serviceCollection.deleteOne(query);
            res.send(result)

        })



    }
    finally{
        
    }

}
run().catch(console.dir)

app.get('/', (req,res) => {
    
    res.send('Running Server')

})




okay


app.listen(port,()=>{
    console.log('Listening to port' ,port);
})