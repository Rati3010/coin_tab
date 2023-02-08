import express from 'express'
import { connection } from "./config/db.js";
import fetch from "node-fetch"
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.get("/getdata",async(req,res)=>{
      try {
        const data = await fetch('https://randomuser.me/api/?results=50');
        const user = await data.json();
        res.send(user)
        res.send('success');
      } catch (error) {
        res.send('failure')
      }
})
app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to database, listeing to port", process.env.port);
  } catch (error) {
    console.log('Unable to connect the data base')
  }
});
