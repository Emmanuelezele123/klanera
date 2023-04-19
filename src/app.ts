
import express, { Application, Request, Response, NextFunction } from "express";
import cors from 'cors';
import connectDB from "../config/db";
const authRouter = require("../routes/auth")
const swaggerUI = require("swagger-ui-express");
const swaggerDoc =  require("swagger-jsdoc");
const User  =  require("../models/user");
const app:Application = express()
app.use(cors())      
app.use(express.json()) 
app.use("/user",authRouter)
app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(swaggerDoc))
// Root route of express app
app.get("/", (req, res) => {
  res.send("<a href='/api-docs'>View Documentation</a>");
}); 
 

connectDB(app)
