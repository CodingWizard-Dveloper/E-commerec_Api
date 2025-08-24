const express = require("express");
const app = express();
const database = require("./config/db");
const PORT = process.env.PORT || 3000;
const routes = require("./routes/index");
const cors = require("cors");
const { v2: cloudinary } = require("cloudinary");

// Middleware
database.connectDB();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3300",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
cloudinary.config({
  api_key: process.env.CLOUDINARY_APIKEY,
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_secret: process.env.CLOUDINARY_SECRETKEY,
});

// routes
app.use("/api/v1", routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
