const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// DB Config

dotenv.config();

app.use(express.urlencoded({ extended: true }));

// Connect to Mongo
mongoose
  .connect(process.env.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }) // Adding new mongo url parser
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

//Routes

app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/courts", require("./routes/api/courts"));

app.get("/", (req, res) => {
  res.send("Server is up and Running");
});

app.listen(PORT, () => `Server running on port ${PORT}`);
