const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 5000;


const uri = "mongodb+srv://TechSpot:tN3JWkfpVxZLyU6D@cluster0.fhwdeyh.mongodb.net/?retryWrites=true&w=majority";



const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {

        await client.connect();
        const productCollection = client.db('productDB').collection('products');

        app.post("/product", async (req, res) => {
            const product = req.body;
            try {
              const result = await productCollection.insertOne(product);
              console.log("Inserted document with _id: " + result.insertedId);
              res.status(201).json({ message: "Product added successfully" });
            } catch (error) {
              console.error(error);
              res.status(500).json({ error: "Failed to insert data into the database" });
            }
          });

          app.get("/product", async (req, res) => {
            const result = await productCollection.find().toArray();
            res.send(result);
          });
          





        await client.db("admin").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Crud is running...");
});

app.listen(port, () => {
    console.log(`Simple Crud is Running on port ${port}`);
});