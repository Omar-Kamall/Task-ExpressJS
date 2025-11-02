const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const ProductRoutes = require("./routes/ProductRoutes");
const AuthRoutes = require("./routes/AuthRoutes");
const cors = require("cors");

dotenv.config();

const port = process.env.PORT || 5050;

const app = express();
app.use(bodyParser.json());

app.use(cors());

// Connect DB
connectDB();

// Use Routes File
app.use(ProductRoutes);
app.use(AuthRoutes);

// listen To Port
app.listen(port, () => {
  console.log("Server Connection Succsessfuly ...!");
});
