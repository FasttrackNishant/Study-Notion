const Tag = require("../models/Tags");

//create tag handler function
exports.createCategories = async (req, res) => {
  try {
    const { name, description } = req.body;

    //validation
    if (!name || !description) {
      return res.statsu(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //create entry in db

    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });
    console.log("Tag entry");

    //return response
    return res.status(200).json({
      success: true,
      message: "Tag Created Successfully ",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get all Tags

exports.showAllCategories = async (req, res) => {
  try {
    const allTags = await Tag.find({}, { name: true, description: true });

    res.status(200).json({
      success: true,
      message: "All Tags returned succcessfully",
      allTags,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//category page details

exports.getCategoryPageDetails = async (req, res) => {
  try {
    //get category id

    const { categoryId } = req.body;

    // get courses for specified category id

    const selectedCategory = await Category.finById(categoryId)
      .populate("courses")
      .exec();

    //validation
    //agar data hi nahi mila toh kuch toh dikha de

    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    //get courses different categories

    const differentCategories = await Category.find({
      _id: { $ne: categoryId },
    })
      .populate("courses")
      .exec();

    //hw :- //get top selling courses

    return res.status(200).json({
      success: true,
      message: "Data found",
      data: { selectedCategory, differentCategories },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Selected Category fail ho gaya ",
    });
  }
};



//contact us ka kam karna hian
/*
bacche se ek mail confirm lo and bacche ko ek mail send karo confirmatino ka*/