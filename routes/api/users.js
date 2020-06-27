const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const User = require("../../models/User");
// Register New User

router.post("/", (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  // Simple validation
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  // Check for existing user
  User.findOne({ email }).then((user) => {
    if (user) return res.status(400).json({ msg: "User already exists" });

    const newUser = new User({
      first_name,
      last_name,
      email,
      password,
    });

    // Create salt & hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then((user) => {
          jwt.sign(
            { id: user.id },
            process.env.jwtSecret,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  email: user.email,
                },
              });
            }
          );
        });
      });
    });
  });
});

//Gets all of the users
router.get("/getAll", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.json({ message: err });
  }
});

//Delete user
router.delete("/deleteUser/:userId", async (req, res) => {
  try {
    const deleteUser = await User.deleteOne({ _id: req.params.userId });
    res.json(deleteUser);
  } catch (err) {
    res.json({ message: err });
  }
});

//update user email
router.put("/updateEmail/:userId", async (req, res) => {
  try {
    const updateEmail = await User.updateOne(
      { _id: req.params.userId },
      { $set: { email: req.body.email } }
    );
    res.json(updateEmail);
  } catch (err) {
    res.json({ message: err });
  }
});

//Add court to favorites
router.put("/addToFavorites/:userId", async (req, res) => {
  try {
    const addCourt = await User.updateOne(
      {
        _id: req.params.userId,
      },
      { $push: { saved_courts: [req.body.saved_courts] } }
    );
    res.json(addCourt);
  } catch (err) {
    res.json({ message: err });
  }
});

//Delete court from favorites

router.put("/deleteCourtFromFavorites/:userId", async (req, res) => {
  try {
    const deleteCourt = await User.updateOne(
      {
        _id: req.params.userId,
      },
      { $pull: { saved_courts: req.body.court_Id } }
    );
    res.json(deleteCourt);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
