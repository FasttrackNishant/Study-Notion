const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');

//mail send karne ka kam ye karge reset password ka

//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {

    try {
        //get email      
        const email = req.body.email;
        //check user , email validation

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.json({
                success: false,
                message: 'User not Found',
            })
        }

        //generateToken
        const token = crypto.randomUUID();

        //update user by adding token and expiration time

        const updatedDetails = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000,
            },
            { new: true },//isse updated document retun hota hain response mein

        )

        //crete url
        const url = `http://localhost:3000/update-password/${token}`;

        //send the mail containing url

        await mailSender(email, "Password Reset Link", url)
        //return response

        return res.json(
            {
                success: true,
                message: "emai sent successfully pls check mail ",
            }
        )
    }
    catch (error) {

        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while resetting password',
        })
    }

}


//reset password

exports.resetPassword = async (req, res) => {
    try {
        //data fetch

        //is token ko toh url mein pass kiya tha but ye bodymein  kaise aa gaya yup frontend ne dala hain body mein
        const { password, confirmPassword, token } = req.body;

        //validation

        if (!password !== confirmPassword) {
            return res.json({
                success: false,
                message: 'password not matching',
            });
        }

        //get userdetails  from db using token 

        const userDetails = await User.findOne({ token: token });

        //if no entry i.e invalid token or time expired

        if (!userDetails) {

            return res.json({
                success: false,
                message: 'Token is invalid '
            })
        }

        //token time check

        if (userDetails.resetPasswordExpires < Date.now()) {

            return res.json({
                success: false,
                message: 'Token is Expired pls regenerate your token',
            })
        }
        //password ko hashed karo

        const hashedPassword = await bcrypt.hash(password, 10);

        //update karde password

        await User.findOneAndUpdate(
            { token: token },
            { password: hashedPassword },
            { new: true },
        );

        //return response

        return res.status(200).json({
            success: true,
            message: 'password reset successfull',
        })
    }
    catch (error) {
        console.log(error);

    }
}