const Course = require("../models/Course");
const Tag = require("../models/User");
const User = require("../models/User");
const uploadImage = require("../utils/imageUploader");

//create course handler function

exports.createCourse = async (req, res) => {
  try {
    //fetch data
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;

    //get thumbnails
    const thumbnail = req.files.thumbnailImage;

    //validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag
    ) {
      return res.status(400).json({
        success: false,
        message: "all Fields are mandatory ",
      });
    }

    //check for instructor

    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log(instructorDetails);

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details not found",
      });
    }

    //check given tag is valid or not
    //tag ek id hain as isko humne by refrecend object pass kiya hain so ye ek id hain
    const tagDetails = await Tag.findById(tag);

    //if tag ki details nahi mili
    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "tagDetails Details not found",
      });
    }

    //uplod Image to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    //Create an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id, //isliye humne instructor id nikali thi
      whatYouWillLearn: whatYouWillLearn,
      price: price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,

      //in this way new course is created
    });

    //add the new course to user schema of Instructor
    //ab id mil gayi us course ke user ke andar couse ki id insert karni hain

    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    //update the tag ka schema

    //return

    return res.status(200).json({
      success: true,
      message: "Course Created Successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create the course",
    });
  }
};

exports.showAllCourses = async (req, res) => {
  try {
    //find call marlo
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        courseDescription: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("Instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "fetched all the courses successfully",
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Can not fetch the data",
      error: error.message,
    });
  }
};

//get all courses

exports.getCourseDetails = async (req, res) => {
  try {
    //get id
    const courseId = req.params.id;
    //find course details
    const courseDetails = await Course.find({ _id: courseId })
      .populate({
        path: "instructor",
        //populate additional details
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        //subsection ko bhi karllo
        populate: {
          path: "subsection",
        },
      })
      .exec();

    //validation

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `course not found with   ${courseId}`,
      });
    }

    //return response

    return res.status(200).json({
      success: true,
      message: "fetched course details successfully",
      data: courseDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Can not fetch the data",
      error: error.message,
    });
  }
};
