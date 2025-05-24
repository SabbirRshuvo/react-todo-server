require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://react-todo-app-dfa57.web.app"],
  })
);
app.use(express.json());

const uri = process.env.MONGODB_URI;

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
    console.log("mongodb connected");
    const database = client.db("react-todo");
    const todoCollection = database.collection("my-todo");

    app.get("/", (req, res) => {
      res.send("todo list connected");
    });

    // create a todo
    app.post("/todos", async (req, res) => {
      const todo = req.body;
      todo.status = "pending";
      const result = await todoCollection.insertOne(todo);
      res.send(result);
    });
    // get my todo list
    app.get("/todos", async (req, res) => {
      const status = req.query.status;
      let filter = {};
      if (status && status !== "all") {
        filter.status = status;
      }
      const result = await todoCollection.find(filter).toArray();
      res.send(result);
    });
    // update my todo data

    app.patch("/todos/:id", async (req, res) => {
      const id = req.params.id;
      const result = await todoCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "complete" } }
      );
      res.send(result);
    });

    app.delete("/todos/:id", async (req, res) => {
      const id = req.params.id;
      const result = await todoCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // });
    app.listen(port, () => {
      console.log(`server is running : ${port}`);
    });
  } catch (error) {
    console.log("mongodb connected error");
  }
}
run();
