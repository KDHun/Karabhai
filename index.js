const express = require("express");
const cors = require("cors");
const app = express();
const weatherRoutes = require("./api/routes/weather");

app.use(cors());
app.use(express.json());
app.use("/", weatherRoutes);

app.listen(3001, () => {
  console.log("Ther server is up and running on " + 3001);
});

module.exports = app;
