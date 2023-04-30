const User = require('../models/user')
import express, { Application, Request, Response, NextFunction } from "express";
const sendEmail = require('../helpers/sendEmail')
require("dotenv").config()
const expiryDate = process.env.EXPIRY_DATE

exports.sendVerification = async(req: Request, res: Response) => {

}
exports.verifyEmail = async(req: Request, res: Response) => {

}
exports.resetPassword= async(req: Request, res: Response) => {

}
exports.changePassword = async(req: Request, res: Response) => {

}