const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
  try {
    //data fetch

    const { sectionName, courseId } = req.body;
    //data validation

    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "missing properties",
      });
    }

    //create section

    const newSection = await Section.create({ sectionName });
    //update course

    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    );

    //hw -> section and subsection ke data ko populate karna hain
    //return response

    return res.status(200).json({
      success: true,
      message: "section created successfully",
      updatedCourseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "unable to create section pls try again",
    });
  }
};

//update section

exports.updateSection = async (req, res) => {
  try {
    //ab naya data hain woh update karna hain

    //input data
    const { sectionName, sectionId } = req.body;
    //data validation
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "missing properties",
      });
    }
    //update data id se update karo

    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );
    //return res

    return res.status(200).json({
      success: true,
      message: "section updated successfully",
      updatedCourseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "unable to create section pls try again",
      error: error.message,
    });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    //get id as id se delte kar denge
    const { sectionId } = req.params;
    //user findByIdAndDelete
    await Section.findByIdAndDelete(sectionId);

    //to do : delete the entry in the course schema

    //return response
    return res.status(200).json({
      success: true,
      message: "Section Deleted Successfully ",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "unable to create section pls try again",
      error: error.message,
    });
  }
};
