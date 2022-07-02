const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors')
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const  jwt = require('jsonwebtoken');
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
        const  orderCollection = client.db('car').collection('order')
        
        // Auth
        app.post ('/login', async(req, res)=>{
            const user =req.body
            const accessToken =jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{
                expiresIn: '1d'
            })
            res.send({accessToken})

        })

        // service Api
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

            // service delete
        app.delete('/service/:id', async (req,res)=>{
            const id =req.params.id
            const query = { _id: ObjectId(id)}

            const result = await serviceCollection.deleteOne(query);
            res.send(result)

        })


        //order Collection Api
        app.post ('/order', async (req,res)=> {

            const order =req.body
            const result= await orderCollection.insertOne(order)
             res.send(result)

        })

        // order show 
        app.get('/order', async(req, res) =>{
            const email = req.query.email;
            const query ={email:email}
            const cursor = orderCollection.find(query)
            const orders = await cursor.toArray()
            res.send (orders)

        })


    }
    finally{

    }

}
run().catch(console.dir)

app.get('/', (req,res) => {
    
    res.send('Running Server')

})

app.listen(port,()=>{
    console.log('Listening to port' ,port);
})

app.listen(port,()=>{
    console.log('Listening to port' ,port);
})