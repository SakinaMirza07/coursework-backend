const express = require("express");
const app = express();

app.use(express.json());
app.set("port", 3000);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  next();
});

const MongoClient = require("mongodb").MongoClient;
let db;

app.get("/collection/products", (req, res, next) => {
  db.collection("products")
    .find({})
    .toArray((err, results) => {
      if (err) return next(err);
      res.send(results);
    });
});

app.post("/collection/orders", (req, res, next) => {
  db.collection("orders")
    .insertOne(req.body)
    .then((result) => res.status(201).send(result))
    .catch((error) => next(error));
});
const ObjectID = require("mongodb").ObjectID;

app.put("/collection/products/:id", (req, res, next) => {
  const activityId = req.params.id;
  const vacancy = req.body.vacancy;
});


MongoClient.connect(
  "mongodb+srv://sakinamirza:786572SfM@cluster0.cnzxt2r.mongodb.net/",
  (err, client) => {
    if (err) {
      console.error("Database connection failed:", err.message);
      return;
    }
    db = client.db("Coursework");
    console.log("Database connected successfully");
  }
);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
