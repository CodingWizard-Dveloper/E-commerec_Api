const express = require("express");
const app = express();
const database = require("./config/db");
database.connectDB();
const PORT = process.env.PORT || 3000;
const routes = require("./routes/index");
const cors = require("cors");

// Middleware
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

// Sample route
app.use("/api/v1", routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
