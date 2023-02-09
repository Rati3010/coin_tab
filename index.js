import express from "express";
import { connection } from "./config/db.js";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { UserModel } from "./models/userModel.js";
dotenv.config();

const app = express();
app.use(express.json());

app.get("/fetchdata", async (req, res) => {
  try {
    const data = await fetch("https://randomuser.me/api/?results=50");
    const user = await data.json();
    const result = user.results;
    for (let i = 0; i < result.length; i++) {
        const new_user = new UserModel(result[i]);
        await new_user.save();
    }
    res.send("success");
  } catch (error) {
    console.log(error)
    res.send("failure");
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
