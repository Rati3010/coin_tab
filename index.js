import express from "express";
import { connection } from "./config/db.js";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { UserModel } from "./models/userModel.js";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.get("/", async (req, res) => {
  try {
    const data = await fetch("https://randomuser.me/api/?results=50");
    const user = await data.json();
    const result = user.results;
    for (let i = 0; i < result.length; i++) {
      result[i]["user_id"] = result[i]["id"];
      delete result[i]["id"];
      console.log(result[i]);
      const new_user = new UserModel(result[i]);
      await new_user.save();
    }
    res.status(200).json({ message: "Succesfully added to the database" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to add to the database" });
  }
});
app.delete("/", async (req, res) => {
  try {
    await UserModel.deleteMany({});
    res.status(200).json({ message: "Deleted users succesfully" });
  } catch (error) {
    res.status(500).json({ message: "Deletion Failed" });
  }
});
app.get("/userdetails", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const users = await UserModel.find()
      .limit(limit * 1)
      .skip((page - 1) * limit);
    res.status(200).json({ total: users.length, users });
  } catch (error) {
    res.status(500).json({ error: "Unable to get the data" });
  }
});
app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to database, listeing to port", process.env.port);
  } catch (error) {
    console.log("Unable to connect the data base");
  }
});
