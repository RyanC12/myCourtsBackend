const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");

dotenv.config();

const Court = require("../../models/Court");

//Gets all of the courts
router.get("/getAll", async (req, res) => {
  try {
    const courts = await Court.find();
    res.json(courts);
  } catch (err) {
    res.json({ message: err });
  }
});

//Add a court

router.post("/addCourt", (req, res) => {
  const { court_name, street, city, state, zip } = req.body;

  if (!court_name || !street || !city || !state || !zip) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  //check for court already listed

  Court.findOne({ court_name }).then((court) => {
    if (court) return res.status(400).json({ msg: "Court already exists" });

    const newCourt = new Court({
      court_name,
      street,
      city,
      state,
      zip,
    });
    newCourt.save().then((court) => {
      res.json({
        court: {
          id: court.id,
          court_name: court.court_name,
          street: court.street,
          city: court.city,
          state: court.state,
          zip: court.zip,
        },
      });
    });
  });
});

//Delete a court

router.delete("/deleteCourt/:courtId", async (req, res) => {
  try {
    const deleteCourt = await Court.deleteOne({ _id: req.params.courtId });
    res.json({ msg: "Court Deleted Successfully!", deleteCourt });
  } catch (err) {
    res.json({ message: err });
  }
});

//Modify a court

router.patch("/updateCourt/:courtId", async (req, res) => {
  try {
    const updateCourt = await Court.updateOne(
      { _id: req.params.courtId },
      { $set: { court_name: req.body.court_name } }
    );
    res.json({ msg: "Court updated Successfully!", updateCourt });
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
