const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//Routes

// app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/users", require("./routes/api/users"));

app.get("/", (req, res) => {
  res.send("Server is up and Running");
});

app.listen(PORT, () => `Server running on port ${PORT}`);
