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
// Logger Middleware to log requests
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.url}`);
  next(); // Proceed to the next middleware or route handler
});
// Serve static files (lesson images) from the 'public/images' folder
app.use('/images', express.static("public/images"));

app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.url}`);
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
  const productId = req.params.id;
  const updatedData = req.body;

  if (!updatedData || Object.keys(updatedData).length === 0) {
    return res.status(400).send({ error: "No update data provided." });
  }

  db.collection("products").updateOne(
    { _id: new ObjectID(productId) },
    { $set: updatedData },
    { safe: true, multi: false },
    (e, result) => {
      if (e) return next(e);
      res.send(
        result.matchedCount === 1
          ? { msg: "Product updated successfully." }
          : { msg: "Product not found." }
      );
    }
  );
});

// Search Route
app.get("/search", (req, res, next) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).send({ error: "Query parameter q is required" });
  }

  db.collection("products")
    .find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
        { price: { $regex: query, $options: "i" } },
        { availability: { $regex: query, $options: "i" } },
      ],
    })
    .toArray((err, results) => {
      if (err) return next(err);
      res.send(results);
    });
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
  console.log(`Server is running on port ${port}`);
});
