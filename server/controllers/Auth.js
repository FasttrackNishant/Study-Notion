const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

//send otp
exports.sendOTP = async (req, res) => {
    try {
        //fetch data 
        const { email } = req.body;

        //check if user alredy exists
        const checkUserPresent = await User.findOne({ email });


        //if exists then return response 

        if (checkUserPresent) {
            return res.status(400).json({
                success: false,
                message: "User Alredy Exists",
            })
        }

        //generate otp

        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })

        console.log("OTP generated");


        //make sure is it unique or not 

        let result = await OTP.findOne({ otp: otp });

        //jab tak sahi otp nahi milta generate karta rahunga 

        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            })
        }

        //ab otp ko db mein daldo

        const otpPayload = { email, otp };

        //create an entry

        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);



        return res.status(200).json({
            sucess: true,
            message: "OTP Sent successfully ",
        })

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })

    }
}

//sign up
exports.signUp = async (req, res) => {

    try {
        //data fetch

        const { firstName, LastName, email, password, confirmPassword, accountType, contactNumber, otp } = req.body;


        //validate data


        if (!firstName || !LastName || !email || !password || !confirmPassword || !otp) {

            return res.status(403).json({
                success: false,
                message: "some data is missing",
            })
        }

        //2 password same chahhiye 

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password doesn't match",
            })

        }

        //check user already exists or not

        const existingUser = await User.findOne({ emai });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User is already registered",
            })
        }
        //find most recent otp for user

        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(recentOtp);

        //validate otp

        if (recentOtp.length == 0) {
            //otp not found 
            return res.status(400).json({
                success: false,
                message: "OTP not found",
            })
        }
        else if (otp != recentOtp.otp) {
            //invalid otp 
            return res.status(400).json({
                success: false,
                message: "invalid OTP",
            })
        }
        //hash password

        const hashedPassword = await bcrypt.hash(password, 10);

        //create entry in db

        const profileDetails = await Profile.create({
            gender: null,
            dateofBirth: null,
            about: null,
            contactNumber: null
        });

        const user = await User.create({
            firstName, lastName, email, contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/6.x/initials/svg?seed=${firstName} ${lastName} `
        })

        //return res

        return res.status(200).json({
            success: true,
            message: "user is registered successfully",
            user,
        })
    }
    catch (error) {

        console.log(error),
            res.status(500).json({
                success: false,
                message: 'user can not be registed plz try again',
            })
    }
}

//login
exports.login = async (req, res) => {

    try {

        //get data from req body

        const { email, password } = req.body;

        //validation data

        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "all fields are required",
            });
        }

        //check user exists or not
        const user = await User.findOne({ email }).populate("additionalDetails");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User is not registered , please sign up',
            })
        }

        //generate jwt , after password matching
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user.id,
                role: user.accountType,

            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expires: "2h",
            });
            user.token = token;
            user.password = undefined;

            //create cookie and send response

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: 'logged in ',
            })

        }
        else {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect ",
            })
        }

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'login failed pls try again ',
        })

    }
}

//changepassword
exports.changePassword = async (req, res) => {
    try {

        //get data 
        // const

        //get old password , new password , confirm new password 
        //vallidatio on data

        // update pwd in db

        //send mail - password updated 

        //return response
    }
    catch (error) {

    }
}

