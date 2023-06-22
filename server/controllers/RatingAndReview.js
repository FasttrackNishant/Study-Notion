const RatingAndReview = require("../models/RatingAndReview9");
const Course = require("../models/Course");

//create rating

exports.createRating = async (req, res) => {
  try {
    //data fetch
    const userId = req.user.id;
    //fetch data
    const { rating, review, courseId } = req.body;
    //check the user is enrolled or not
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elementMatch: { $req: userId } },
    });

    if (!courseDetails) {
      return res.status(404).json({
        succes: false,
        message: "You are not enrolled in this course",
      });
    }

    //check kya pehle se hi review de rakha ho

    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "You have already rated this course",
      });
    }
    //create the rating

    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    //update the course with rating and review

    const updatedCourseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReviews: ratingReview._id,
        },
      },
      { new: true }
    );

    console.log(updatedCourseDetails);
    //return response

    return res.status(200).json({
      success: true,
      message: "Rating and Review Successfully ",
      ratingReview,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      succes: false,
      message: "rating and review failed ",
      error: error.message,
    });
  }
};

//getAverageRating

exports.getAverageRating = async (req, res) => {
  try {
    //get course Id
    const courseId = req.params.courseId;

    //calulate average Rating

    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    //return rating
    //agar di hoh toh thik nahi  toh return toh karni hi hian

    //yaha exist karte hain
    if (result.rating > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }

    //if no return exist
    return res.status(200).json({
      success: true,
      message: "average rating not found",
      averageRating: 0,
    });

    //return response
  } catch (error) {}
};

//getAllRating and Reviews

exports.getAllRatingAndReviews = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "all review fetched Successfully",
      data: allReviews,
    });
  } catch (error) {
    return res.status(500).json({
      succes: false,
      message: "rating and review failed fecthing failed ",
      error: error.message,
    });
  }
};

//h.w. course id ke  corresponding review
