// pages/create-fundraiser.js
import React from "react";
import Navbar from "../components/Navbar"; // Make sure this path is correct
import FundRiserForm from "../components/FundRiserForm";

const CreateFundraiser = () => {
  return (
    <>
      <Navbar />
      <div className="px-4 py-8 max-w-xl mx-auto"> {/* Changed max-w-2xl to max-w-xl */}
        <h2 className="text-3xl font-bold mb-6 text-center">Create a Fundraiser</h2>
        <div className="card w-full p-6"> {/* Added padding */}
          <FundRiserForm />
        </div>
      </div>
    </>
  );
};

export default CreateFundraiser;
