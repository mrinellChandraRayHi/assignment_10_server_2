const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.maridib.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        //await client.connect();
        const database = client.db("ceramicsAndPotterysDB");
        const ceramicsAndPotteryCollection = database.collection("ceramicsAndPottery");

        app.get('/crafts', async(req, res)=>{
            const cursor=ceramicsAndPotteryCollection.find()
            const result=await cursor.toArray();
            res.send(result);
        })

        app.post('/crafts', async(req, res)=>{
            const craft=req.body;
            const result = await ceramicsAndPotteryCollection.insertOne(craft);
            res.send(result);
        })

        app.delete('/crafts/:id', async(req, res)=>{
            const id=req.params.id;
            console.log(id);
            const query={_id: new ObjectId(id)}
            const result=await ceramicsAndPotteryCollection.deleteOne(query);
            res.send(result);
        })

        app.get('/crafts/:id', async(req, res)=>{
            const id=req.params.id;
            console.log(id);
            const query={_id: new ObjectId(id)}
            const result=await ceramicsAndPotteryCollection.findOne(query);
            res.send(result);
        })

        app.put('/crafts/:id', async(req, res)=>{
            const id=req.params.id;
            const craft=req.body;
            console.log(id, craft);

            const filter={_id:new ObjectId(id)}
            const crafts={
                //item_name, subcategory_name, price, customization, processing_time, description, photo, _id
                $set:{
                    item_name:craft.item_name,
                    subcategory_name:craft.subcategory_name,
                    price:craft.price,
                    customization:craft.customization,
                    processing_time:craft.processing_time,
                    description:craft.description,
                    photo:craft.photo
                }
            }
            const options={upsert:true}
            const result=await ceramicsAndPotteryCollection.updateOne(filter, crafts, options);
            res.send(result);
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})