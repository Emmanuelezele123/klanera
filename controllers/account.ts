const User = require('../models/user')
import express, { Application, Request, Response, NextFunction } from "express";
const sendEmail = require('../helpers/sendEmail')

const Otp = require('../models/otp')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
require("dotenv").config()
const expiryDate = process.env.EXPIRY_DATE
const { createToken,createAccessToken,createRefreshToken,decodeToken,generateToken } = require('../helpers/jwtService')

exports.resendOtp = async(req: Request, res: Response) => {
    try {
        const user = await User.findOne({ email:req.body.email }).select('_id');

    if (!user) {
     return res.status(404).json({ message: 'User not found with '+req.body.email });
      
    }
    const userId: string = user._id.toString();


        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const newOtp = new Otp({
          userId: userId,
          otpText: otp
        });
        const result = await newOtp.save();
        sendEmail(req.body.email, "Otp verification Code for Klanera app ", `Your verification code is ${otp}`, res, "code");
      } catch (err:any) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }

    }

exports.verifyOtp = async(req: Request, res: Response) => {
    const otp = req.body.otp;
    const email = req.body.email;
  try {   
    const user = await User.findOne({ email:req.body.email }).select('_id');

    if (!user) {
     return res.status(404).json({ message: 'User not found' });
      
    }
    const userId: string = user._id.toString();

    const otps = await Otp.findOne({ userId: userId ,otpText :otp });

     if (otps) {
    await Otp.deleteMany({ userId: userId });
    user.verified = "true"
    await user.save()

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    const cookieOptions:any = {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'strict',
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);

    return res.status(200).json({
      success: true,
      message: 'Pin Correct !! Your account has been verified ',
      user,
      accessToken,
    });



      } else {
    return res.status(401).json({ message: "Invalid Otp" });
  }
  } catch(err:any) {
    console.log(err.message);
    console.error(err);
    return res.json({ Error: err.message });
  }
}
exports.resetPassword= async(req: Request, res: Response) => {
    try {
        const foundUser = await User.findOne({ email: req.body.email })
        if (!foundUser) {
          return res.status(404).json({ message: 'User not found' })
        }
    
        // Generate a password reset token and set it on the user's account
        const passwordResetToken = generateToken()
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