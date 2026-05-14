const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Please add a name"] },
    email: { type: String, required: [true, "Please add an email"], unique: true },
    password: { type: String, required: [true, "Please add a password"] },
    phone: { type: String },
    createdAt: { type: Date, default: Date.now },
    lastLoginAt: { type: Date },
    lastLoginLocation: { ip: String, city: String, region: String, country: String },

    // OTP based reset
    passwordResetOTP: String,
    passwordResetExpires: Date,

    // Demat / Non-Demat Details
    dematDetails: {
        hasDemat: Boolean,
        panCard: String,
        dob: Date,
        dpId: String,
        boId: String,
        bankAccountNumber: String,
        ifsc: String,
        mobile: String,
        email: String,
        signatureFile: String,
    },
    noDematDetails: {
        bankName: String,
        accountNumber: String,
        ifsc: String,
        upiId: String,
        email: String,
        aadhaarFile: String,
        panFile: String,
        addressProofFile: String,
        bankProofFile: String,
        passportPhotoFile: String,
        signatureFile: String,
    },
});

module.exports = mongoose.model("User", userSchema);
