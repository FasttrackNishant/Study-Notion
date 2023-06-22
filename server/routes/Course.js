const express = require("express");
const router = express.Router();

const {
  createCourse,
  showAllCourses,
  getCourseDetails,
} = require("../controllers/Course");

//categories controller

const {
  showAllCategories,
  createCategories,
  categoryPageDetails,
} = require("../controllers/Categories");

//sections controller import

const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Sections");

//sub section controller import

const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/SubSections");

//Rating controller import

const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/Ratings");

//importing middlewares

const {
  auth,
  isInstructor,
  isStudent,
  isAdmin,
} = require("../middlewares/auth");

//Courses Routes

//only instructor can add
router.post("/createCourse", auth, isInstructor, createCourse);

//add section
router.post("/createSection", auth, isInstructor, createSection);

//update Section
router.post("/updateSection", auth, isInstructor, updateSection);

//delete section
router.post("/deleteSection", auth, isInstructor, deleteSection);

//~~~~~~Subsections

//edit
router.post("/updateSubsection", auth, isInstructor, updateSubSection);

//delete
router.post("/deleteSubsection", auth, isInstructor, deleteSubSection);

//add sub section to section
router.post("/addSubsection", auth, isInstructor, createSubSection);

//~~~~~~~~~~Courses
//get all courses
router.get("/getAllCourses", auth, isInstructor, getAllCourses);

//get all registered
router.get("/getCourseDetails", auth, isInstructor, getCourseDetails);

// ~~~~~~~~Category Routes by the Admin

//category creation only by admin
router.post("/createCategory", auth, isAdmin, createCategory);
//show all Category
router.get("/showAllCategories", auth, isInstructor);
//category page details
router.get("/getCategoryPageDetails", categoryPageDetails);

//~~~~~~~~Rating and Reviews

router.post("/createRating", auth, isAdmin, createCategory);
router.get("/getAverageRating", getAverageRating);
router.get("/getAllRatingAndReviews", getAllRatingAndReviews);


module.exports = router;