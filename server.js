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

app.param('collectionName', (req, res, next, collectionName) => {
  req.collection = db.collection(collectionName)
  return next()
})

app.get('/collection/:collectionName', (req, res, next) => {
  req.collection.find({}).toArray((e, results) => {
      if (e) return next(e)
      res.send(results)
  })
})

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
