// const mongoose = require("mongoose");
import mongoose from "mongoose";
// require("dotenv").config();
import * as dotenv from "dotenv";
dotenv.config();
const connection = mongoose.connect(process.env.url);
export {connection}
