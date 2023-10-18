const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb"); // Import ObjectId from mongodb
const cors = require("cors");
const app = express();

const port = process.env.PORT || 5000;

const uri =
    "mongodb+srv://TechSpot:tN3JWkfpVxZLyU6D@cluster0.fhwdeyh.mongodb.net/?retryWrites=true&w=majority";

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
