const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const dotenv = require('dotenv'); // Import dotenv

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fhwdeyh.mongodb.net/?retryWrites=true&w=majority`;

// const uri = `mongodb+srv://TechSpot:tN3JWkfpVxZLyU6@cluster0.fhwdeyh.mongodb.net/?retryWrites=true&w=majority`;
// const uri = `mongodb+srv://TechSpot:GcUyqG3Ne9TIVZDH@cluster0.fhwdeyh.mongodb.net/?retryWrites=true&w=majority`;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fhwdeyh.mongodb.net/?retryWrites=true&w=majority`;
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
        const productCollection = client.db("productDB").collection("products");
        const userCollection = client.db("productDB").collection("user");
        const productCartCollection = client.db("productDB").collection("cart");

        //product api
        app.post("/product", async (req, res) => {
            const product = req.body;
            try {
                const result = await productCollection.insertOne(product);
                console.log("Inserted document with _id: " + result.insertedId);
                res.status(201).json({ message: "Product added successfully" });
            } catch (error) {
                console.error(error);
                res
                    .status(500)
                    .json({ error: "Failed to insert data into the database" });
            }
        });

        app.get("/product", async (req, res) => {
            const result = await productCollection.find().toArray();
            res.send(result);
        });


        app.get("/product/:id", async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id),
            };
            const result = await productCollection.findOne(query);
            res.send(result);
        });

        app.get("/product/update/:id", async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id),
            };
            const result = await productCollection.findOne(query);
            res.send(result);
        });



        app.put("/product/update/:id", async (req, res) => {
            const id = req.params.id;
            const data = req.body;

            console.log("id", id, data);

            const filter = { _id: new ObjectId(id) };
            const updatedProduct = {
                $set: {
                    name: data.name,
                    image: data.image,
                    brandName: data.brandName,
                    type: data.type,
                    price: data.price,
                    shortDescription: data.shortDescription,
                    rating: data.rating,
                },
            };

            try {
                const result = await productCollection.updateOne(filter, updatedProduct);
                if (result.modifiedCount === 1) {
                    res.json({ message: "Product updated successfully" });
                } else {
                    res.status(404).json({ error: "Product not found" });
                }
            } catch (error) {
                console.error("Error updating product:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });

        app.delete("/product/:id", async (req, res) => {
            const id = req.params.id;
            console.log("delete", id);
            const query = {
                _id: new ObjectId(id),
            };
            const result = await productCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        });

        //User api
        app.post("/user", async (req, res) => {
            const user = req.body;
            console.log(user);
            try {
                const result = await userCollection.insertOne(user);
                console.log("Inserted document with _id: " + result.insertedId);
                res.status(201).json({ message: "User added successfully" });
            } catch (error) {
                console.error(error);
                res
                    .status(500)
                    .json({ error: "Failed to insert data into the database" });
            }
        });


        app.get("/user", async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        });
        // single user 
        app.get("/user/:id", async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id),
            };
            const result = await userCollection.findOne(query);
            res.send(result);
        });


        //card user data 

        app.post("/cart", async (req, res) => {
            const product = req.body;
            console.log(product);
            try {
                const result = await productCartCollection.insertOne(product);
                console.log("Inserted document with _id: " + result.insertedId);
                res.status(201).json({ message: "Product added successfully" });
            } catch (error) {
                console.error(error);
                res
                    .status(500)
                    .json({ error: "Failed to insert data into the database" });
            }
        });

        app.get("/cart/:id", async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id),
            };
            const result = await productCartCollection.findOne(query);
            res.send(result);
        });

        app.get("/cart", async (req, res) => {
            const result = await productCartCollection.find().toArray();
            res.send(result);
        });

        app.delete("/cart/:id", async (req, res) => {
            const id = req.params.id;
            console.log("delete", id);
            const query = {
                _id: new ObjectId(id),
            };
            const result = await productCartCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        });


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
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
