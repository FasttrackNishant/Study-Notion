const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    //get the data
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
    //get user id

    const id = req.user.id; //imp hain path dekh lo

    //validation in the data

    if (!contactNumber || contactNumber.length < 10 || !gender || !id) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    //find profile ..pehle user ko le ke aoo

    const userDetails = await User.findById({ id });
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById({ profileId });

    //update profile

    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;

    //return response

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profileDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "profile updation failed",
      error: error.message,
    });
  }
};

//Delete a profile

exports.deleteAccount = async (req, res) => {
  try {
    //get id
    const id = req.user.id;
    //validation

    const userDetails = await User.findById(id);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //profile delete karde

    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });

    //user delete karde

    await User.findByIdAndDelete({ _id: id });

    //To Do : schedule a delete request for the user

    //return response

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Account deletion failed",
      error: error.message,
    });
  }
};



exports.getAllUserDetails = async (req, res) =>
{
    try {
        
        const id = req.user.id;

        const userDetails = await User.findById(id).populate('additionalDetails').exec();



        return res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            userDetails,
        })
    } catch (error) {
        

        return res.status(500).json({
            success: false,
            message: "User details fetch failed",
            error: error.message,
        })
    }
}