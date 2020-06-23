const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");

dotenv.config();

const Court = require("../../models/Court");
