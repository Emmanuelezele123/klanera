const User = require('../models/user')
import express, { Application, Request, Response, NextFunction } from "express";
const sendEmail = require('../helpers/sendEmail')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
require("dotenv").config()
const expiryDate = process.env.EXPIRY_DATE
const { createToken,decodeToken } = require('../helpers/jwtService')

exports.sendVerification = async(req: Request, res: Response) => {
    try {
        const foundUser = await User.findOne({ email: req.body.email })
        if (!foundUser) {
          return res.status(404).json({ message: 'User not found' })
        }
    
        const token = createToken(foundUser)
        const link = `${process.env.BASE_URL}/account/verifyEmail/${token}`;
     
        sendEmail(foundUser.email, "Email Verification", link, res, "verify_email")

        return res.status(200).json({ message: 'Email sent successfully' })
      } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Internal server error' })
      }
    }

exports.verifyEmail = async(req: Request, res: Response) => {
    try {
        // Verify the email verification token
        const decodedToken = decodeToken(req.params.token)
        const foundUser = await User.findById(decodedToken.id)
        if (!foundUser) {
          return res.status(404).json({ message: 'User not found' })
        }
    
        // Update the user's email verification status
        foundUser.verified = "true"
        await foundUser.save()
    
        return res.status(200).json({ message: 'Email verified successfully' })
      } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Internal server error' })
      }
}
exports.resetPassword= async(req: Request, res: Response) => {
    try {
        const foundUser = await User.findOne({ email: req.body.email })
        if (!foundUser) {
          return res.status(404).json({ message: 'User not found' })
        }
    
        // Generate a password reset token and set it on the user's account
        const passwordResetToken = bcrypt.genSaltSync(10)
        foundUser.passwordResetToken = passwordResetToken
        foundUser.passwordResetTokenExpiration = new Date(Date.now() + 3600000) // 1 hour from now
        await foundUser.save()
    
        // Send a password reset email to the user's email address with a link containing the password reset token
        
        const link = `${process.env.BASE_URL}/reset-password?token=${passwordResetToken}`;
     console.log(passwordResetToken)
        sendEmail(foundUser.email, "Change Password", link, res, "email")

        return res.status(200).json({ message: 'Password reset email sent successfully' })
      } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Internal server error' })
      }
}
exports.changePassword = async(req: Request, res: Response) => {
    try {
        // Find the user with the password reset token
        const foundUser = await User.findOne({ 
          passwordResetToken: req.params.token,
          passwordResetTokenExpiration: { $gt: Date.now() }
        })
        if (!foundUser) {
          return res.status(404).json({ message: 'Invalid or expired password reset token' })
        }
    
        // Hash the new password and update the user's password on their account
        const hashedPassword = bcrypt.hashSync(req.body.newPassword, 10)
        foundUser.password = hashedPassword
        foundUser.passwordResetToken = undefined
        foundUser.passwordResetTokenExpiration = undefined
        await foundUser.save()
    
        return res.status(200).json({ message: 'Password changed successfully' })
      } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Internal server error' })
      }
}