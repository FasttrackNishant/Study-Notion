const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");

//capute the payment  & initiate the razor pay order

exports.capturePayment = async (req, res) => {
  try {
    //get course id and user id

    const { course_id } = req.body;
    const userId = req.user.id;

    //validation

    //valid courseId
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid course id",
        error: error.message,
      });
    }
    //valid courseDetail
    let course;
    try {
      course = await Course.findById(course_id);
      if (!course) {
        return res.status(400).json({
          success: false,
          message: "Could not find the course",
          error: error.message,
        });
      }
      //user already pay for the course
      //ab check karo ki user ne alredy buy kiya hain ya nahi
      //convert user id to object id

      const uid = mongoose.Types.ObjectId(userId);
      if (course.studentEnrolled.include(uid)) {
        return res.status(400).json({
          success: false,
          message: "student already enrolled",
          error: error.message,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    //order create

    const amount = course.price;
    const currency = "INR";

    //create option amount

    const options = {
      amount: amount * 100,
      currency,
      receipt: Math.random(Date.now()).toString,
      notes: {
        course: course_id,
        userId,
      },
    };

    //ab create function call maro

    try {
      //initiate the payment using razor pay
      const paymentResponse = await instance.orders.create(options);
      console.log(paymentResponse);

      //return response

      return res.status(200).json({
        success: true,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        thumbnail: course.thumbnail,
        orderId: paymentResponse.id,
        currency: paymentResponse.currency,
        amount: paymentResponse.amount,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Could not initiate order",
        error: error,
      });
    }
  } catch (error) {
    //return response

    return res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

//verify Signature

exports.verifySignature = async (req, res) => {
  //mathcin karni hain server ka and razorpay ka

  //ye webhook se aaya hain
  const webhookSecret = "12345678";
  //ye razor pay se aaya hain

  //ab ye id encrpyted hogi isko toh decrypt nahi kar sakte but joh webhook ka secrete hain usko toh encrypt kar sakte hain

  const signature = req.headers["x-razorpay-signature"];
  const shasum = crypto.createHmac("sha256", webhookSecret);
  //convert it into string
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (signature === digest) {
    console.log("Payment is authorized");

    const { course_id, userId } = req.body.payload.payment.entity.notes;

    try {
      //action

      //action : course dedo user ko
      //find the course and enroll the student

      const enrolledCourse = await Course.findOneAndUpdate(
        { id: course_id },
        {
          $push: {
            studentEnrolled: userId,
          },
        },
        { new: true }
      );

      if (!enrolledCourse) {
        return res.status(500).json({
          success: false,
          message: "course not found",
        });
      }

      console.log(enrolledCourse);

      //student mein course ko update karo

      const enrolledStudent = await User.findOneAndUpdate(
        { _id: userId },
        {
          $push: { courses: courseId },
        },
        { new: true }
      );

      console.log(enrolledStudent);

      //mail send kardo

      const emailResponse = await mailSender(
        enrolledStudent.email,
        "mil gaya course",
        "congraturlattion course lele "
      );

      console.log(emailResponse);

      return res.status(200).json({
        success: true,
        courseName: enrolledCourse.courseName,
        courseDescription: enrolledCourse.courseDescription,
        thumbnail: enrolledCourse.thumbnail,
        orderId: emailResponse.orderId,
        message: "signature verified and email send ",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  //agar signature match naho hua toh
  else {
    return res.status(400).json({
      success: false,
      message: "signature not match",
    });
  }
};
