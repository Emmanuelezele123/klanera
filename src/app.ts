
import express, { Application, Request, Response, NextFunction } from "express";
import cors from 'cors';
import connectDB from "../config/db";
const authRouter = require("../routes/auth")
const accountRouter = require("../routes/account")
const swaggerUI = require("swagger-ui-express");
const swaggerDoc =  require("swagger-jsdoc");
const User  =  require("../models/user");
const app:Application = express()
app.use(cors())      
app.use(express.json()) 
app.use("/user",authRouter)
app.use("/account",accountRouter)
// Root route of express app
app.get("/", (req, res) => {
  res.send("klanera api");
}); 
 

connectDB(app)
