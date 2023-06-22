const Subsection = require("../models/subsection");
const Section = require("../models/Section");
const uploadImageToCloudinary = require("../models/uploadImageToCloudinary");

exports.createSubsection = async (req, res) => {
  try {
    //fetch the required data from req body

    const { sectionId, title, timeDuration, description } = req.body;

    //extract file/video
    const video = req.files.videoFile;

    //validation

    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }

    //ab hamare db mein toh url used hain so upload on cloudinary

    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    //ISSE secure url mil jayega
    //create subsetion

    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    //insert section with this subsection

    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          subSection: subSectionDetails._id,
        },
      }
    );

    //hw log updated section after adding populate qurey

    //return response

    return res.status(200).json({
      success: true,
      message: "data updated in the subsection",
      updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update subsection and delete subsection
 