const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/emailService");
const axios = require("axios");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Multer config for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // uploads folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

const saveUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { hasDemat, email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (hasDemat === "true") {
            user.dematDetails = {
                hasDemat: true,
                panCard: req.body.panCard,
                dob: req.body.dob,
                dpId: req.body.dpId,
                boId: req.body.boId || "",
                bankAccountNumber: req.body.bankAccountNumber,
                ifsc: req.body.ifsc,
                mobile: req.body.mobile,
                email: email,
                signatureFile: "",
            };
        } else {
            user.noDematDetails = {
                bankName: req.body.bankName,
                accountNumber: req.body.accountNumber,
                ifsc: req.body.ifsc,
                upiId: req.body.upiId,
                email: email, // ab store hoga
                aadhaarFile: "",
                panFile: "",
                addressProofFile: "",
                bankProofFile: "",
                passportPhotoFile: "",
                signatureFile: "",
            };
        }

        await user.save(); 

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        let subject, text;

        if (hasDemat === "true") {
            subject = "Demat Account Details Fetched";
            text = "Your existing Demat account details have been successfully fetched.";
        } else {
            subject = "Demat Account Opened";
            text = "Congratulations! Your Demat account has been successfully opened.";
        }

        await transporter.sendMail({
            from: `"Quanture" <${process.env.EMAIL_USER}>`,
            to: email,
            subject,
            text,
        });

        res.status(200).json({ message: "Form submitted and confirmation email sent." });
    } catch (error) {
        console.error("Save User Details Error:", error);
        res.status(500).json({ message: "Failed to send confirmation email." });
    }
};

const registerUser = async (req, res) => {
    const { name, email, password, phone } = req.body;

    try {

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

        let location = { ip };
        try {
            const response = await axios.get(`http://ip-api.com/json/${ip}`);
            if (response.data.status === "success") {
                location = {
                    ip,
                    city: response.data.city || "Unknown",
                    region: response.data.regionName || "Unknown",
                    country: response.data.country || "Unknown",
                };
            }
        } catch (err) {
            console.log("IP location fetch failed:", err.message);
        }

        user.lastLoginAt = new Date();
        user.lastLoginLocation = location;
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            lastLoginAt: user.lastLoginAt,
            lastLoginLocation: user.lastLoginLocation, 
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc Forgot Password - Send OTP
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Generate OTP (6 digit)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.passwordResetOTP = otp;
        user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 min expiry
        await user.save();

        // Send OTP to email with contact info
        const emailContent = `
  <html>
    <body>
      <p>Your OTP is <b>${otp}</b>. It is valid for 10 minutes.</p>
      <hr />
      <p>If you are not trying to reset the password, please contact <b>Neav Panjwani</b> at <b>+91-7666491809</b>.</p>
    </body>
  </html>
`;


        await sendEmail(
            user.email,
            "Password Reset OTP – Quanture",
            emailContent
        );

        res.json({ message: "OTP sent to email" });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc Reset Password with OTP
const resetPassword = async (req, res) => {
    const { email, otp, password } = req.body;

    try {
        const user = await User.findOne({
            email,
            passwordResetOTP: otp,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Clear OTP fields
        user.passwordResetOTP = undefined;
        user.passwordResetExpires = undefined;

        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    saveUserDetails,
    getProfile,
    upload,
};
