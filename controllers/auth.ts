const User = require('../models/user')
import express, { Application, Request, Response, NextFunction } from "express";
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const sendEmail = require('../helpers/sendEmail')
require("dotenv").config()
const expiryDate = process.env.EXPIRY_DATE
const { createToken,createAccessToken,createRefreshToken } = require('../helpers/jwtService')

exports.registerNewUser = async (req: Request, res: Response) => {
    try {
        const existingUser = await User.findOne({ username: req.body.username })
        if (existingUser) {
            return res.status(400).json({ message: 'a user with this username already exists' })
        }

        const newUser = await User.create({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            verified: "false"
        })

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        newUser.password = hashedPassword

        const savedUser = await newUser.save()

        const token = createToken(savedUser)
        if (!token) {
            return res.status(500).json({ message: "sorry, we could not authenticate you, please login" })
        }

        return res.status(200).json({
            success: true,
            message: "New klanera user added",
            token: token
        })
    } catch (err) {
        return res.status(500).json({ err })
    }
}

exports.loginUser = async (req: Request, res: Response) => {
    try {
        const foundUser = await User.findOne({ email: req.body.email })
        if (!foundUser) {
          return res.status(401).json({ message: "Email Address not found" })
        }
        const match = bcrypt.compareSync(req.body.password, foundUser.password)
        if (!match) {
          return res.status(401).json({ message: "incorrect password" })
        }
        const accessToken = createAccessToken(foundUser)
        const refreshToken = createRefreshToken(foundUser)
      
        if (!accessToken || !refreshToken) {
          return res.status(500).json({ message: "sorry, we could not authenticate you, please login" })
        }
      
        // Store the refresh token in the user's database record
        foundUser.refreshToken = refreshToken
        await foundUser.save()
      
        return res.status(200).json({
          success: true,
          message: "klanera USER LOGGED IN",
          user: foundUser,
          accessToken: accessToken,
          refreshToken: refreshToken
        })
      } catch (err) {
        return res.status(500).json({ err })
      }
      
}
