import React from "react";
// import { BsArrowBarRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import HighlightText from "../components/core/HomePage/HighlightText";
import CTAButton from "../components/core/HomePage/Button";
import Banner from "../assets/Images/banner.mp4";

const Home = () => {
  return (
    <div>
      {/* Section 1 */}

      <div
        className="  relative mx-auto flex flex-col w-11/12 items-center max-w-maxContent text-white 
      justify-between "
      >
        {/* first button */}
        <Link to={"/signup"}>
          {/* rounded btn and contentn with arrow */}
          <div className=" group mt-16  mx-auto rounded-full bg-richblack-800 font-bold text-[#999DAA] transition-all duration-150 hover:scale-95 w-fit">
            <div className="flex flex-row items-center gap-1 rounded-full px-4 py-3 group-hover:bg-richblack-900">
              <p>Become an Instructor → </p>
            </div>
          </div>
        </Link>

        {/* heading */}
        <div className="text-center text-4xl font-semibold mt-7">
          Empower Your Future with
          <HighlightText text={"Coding Skills"} />
        </div>

        {/* paragraph */}
        <div className="w-[90%] text-center mt-4 text-[#838894] font-bold ">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>
      </div>

      {/* two buttons */}
      <div className="flex flex-row gap-7 mt-8 justify-center">
        <CTAButton active={true} linkto={"/signup"}>
          {" "}
          Learn More
        </CTAButton>
        <CTAButton active={false} linkto={"/login"}>
          {" "}
          Book a Demo
        </CTAButton>
      </div>

      {/* video section */}

      <div className="shadow-blue-200 mx-3 my-5 h-4">
        <video muted autoplay loop>
          <source src={Banner} type="video/mp4/" />

        </video>
      </div>
      <video src="../assets/Images/banner.mp4" height="45px"></video>

      {/* Section 2 */}

      {/* Section 3 */}

      {/* Footer */}
    </div>
  );
};

export default Home;
