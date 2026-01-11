import React from "react";
import authWrapper from "../helper/authWrapper";
import { useSelector } from "react-redux";
import FundRiserCard from "../components/FundRiserCard";
import Loader from "../components/Loader";

const Dashboard = () => {
  const projectsList = useSelector((state) => state.projectReducer.projects);

  return (
    <div className="px-2 py-4 lg:px-12 min-h-screen bg-gray-100">
      {/* Introductory Text */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Crowd Mint</h1>
        <p className="text-xl text-gray-600 mt-2">The Future of Crowdfunding</p>
      </div>

      {/* Project Cards Section */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-4 lg:gap-4">
        {projectsList !== undefined ? (
          projectsList.length > 0 ? (
            projectsList.map((data, i) => (
              <div className="w-full" key={i}>
                <FundRiserCard props={data} />
              </div>
            ))
          ) : (
            <h1 className="text-2xl font-bold text-gray-500 text-center font-sans">
              No project found!
            </h1>
          )
        ) : (
          <Loader />
        )}
      </div>

      {/* Video Section Below the Project Cards */}
      <div className="w-full mt-10 relative">
        <video
          className="object-contain w-full h-auto rounded-lg"
          autoPlay
          loop
          muted
        >
          <source src="/intro-video.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default authWrapper(Dashboard);
