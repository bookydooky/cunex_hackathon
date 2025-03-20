"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Share2, Users, Clock } from "lucide-react";
import PopupWindow from "../components/CollaborateWindow";

const CreateJobPreview = () => {
  const router = useRouter();

  //Chien
  const [jobDetails, setJobDetails] = useState({
    workTitle: "",
    workType: "",
    price: "",
    duration: "",
    description: "",
  });
  useEffect(() => {
    const savedData = localStorage.getItem("jobDetails");
    if (savedData) {
      setJobDetails(JSON.parse(savedData));
    }
  }, []);
  const handleChange = (e) => {
    setJobDetails({ ...jobDetails, [e.target.name]: e.target.value });
  };
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const handleCollaborateClick = () => {
    setIsPopupVisible(true);
  };
  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };
  const handlePreviousPage = () => {
    router.push("/");
  };
  const handleNextPage = () => {
    localStorage.setItem("jobDetails", JSON.stringify(jobDetails));
    console.log("Saved to localStorage:", jobDetails);
    router.push("/portfolio");
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* App Header */}
      <div className="sticky top-0 left-0 right-0 px-4 py-5 flex items-center justify-between bg-white z-1">
        <div className="flex items-center">
          <button
            onClick={handlePreviousPage}
            className="transition-transform transform active:scale-90"
          >
            <ArrowLeft className="mr-4 text-pink-500 hover:text-pink-800" />
          </button>
          <div className="flex items-center">
            <div className="font-bold text-lg">
              <span className="text-pink-500">CU</span>
              <span className="text-black">NEX</span>
            </div>
            <div className="h-6 border-l border-gray-300 mx-5"></div>
            <div className="text-pink-500 text-xl font-medium">Create Job</div>
          </div>
        </div>
        <Share2 className="text-black" />
      </div>
        {/* Progress Bar */}
        <div className="flex px-4 mt-4">
          <div className="h-1 bg-pink-500 flex-1 rounded-full mr-2"></div>
          <div className="h-1 bg-gray-200 flex-1 rounded-full ml-2"></div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {/* User Profile Section */}
          <div className="bg-white p-4 rounded-lg mb-8">
            <div className="flex items-start mb-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                <Users size={28} className="text-pink-300" />
              </div>
              <div className="ml-4">
                <div className="font-bold text-xl text-black">Maria Schmidt</div>
                <div className="flex items-center">
                  <div className="text-yellow-400">★</div>
                  <div className="ml-1 font-medium text-black">4.9</div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-pink-50 p-4 rounded-lg">
                <div className="flex items-center text-pink-500 mb-1">
                  <div className="w-4 h-4 mr-2">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M8 12L11 15L16 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-black">Success Rate</span>
                </div>
                <div className="font-bold text-lg text-black">98%</div>
              </div>

              <div className="bg-pink-50 p-4 rounded-lg">
                <div className="flex items-center text-pink-500 mb-1">
                  <Users size={16} className="mr-2" />
                  <span className="text-sm text-black">Jobs Sold</span>
                </div>
                <div className="font-bold text-lg text-black">156</div>
              </div>

              <div className="bg-pink-50 p-4 rounded-lg">
                <div className="flex items-center text-pink-500 mb-1">
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="mr-2 text-pink-500"
                  >
                    <path d="M16 5v2a10 10 0 0 1-10 10h0c0-5.5 4.5-10 10-10h2m-2-2h7v7" />
                  </svg>
                  <span className="text-sm text-black">Rehired</span>
                </div>
                <div className="font-bold text-lg text-black">42 times</div>
              </div>

              <div className="bg-pink-50 p-4 rounded-lg">
                <div className="flex items-center text-pink-500 mb-1">
                  <Clock size={16} className="mr-2" />
                  <span className="text-sm text-black">Avg. Response</span>
                </div>
                <div className="font-bold text-lg text-black">2 hours</div>
              </div>
            </div>
          </div>

          {/* Job Details Form */}
          <div className="bg-white p-4 rounded-lg mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black">Job Details</h2>
              <button
                onClick={handleCollaborateClick}
                className="mr-2 transition-transform transform active:scale-90"
              >
                <Users size={25} className="text-pink-500 hover:text-pink-800" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-black mb-2">Work Title</label>
              <input
                type="text"
                name="workTitle"
                value={jobDetails.workTitle}
                onChange={handleChange}
                placeholder="Enter the title of the work"
                className="w-full p-3 border border-gray-300 rounded-lg text-black"
              />
            </div>

            <div className="mb-4">
              <label className="block text-black mb-2">Type of Work</label>
              <div className="relative">
                <select
                  name="workType"
                  value={jobDetails.workType}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg appearance-none text-black"
                >
                  <option value="" disabled>
                    Select work type
                  </option>
                  <option value="UXUI">UX/UI</option>
                  <option value="Coding">Coding</option>
                  <option value="Graphic">Graphics</option>
                  <option value="Video">Video</option>
                  <option value="Tutoring">Tutoring</option>
                  <option value="Language">Language</option>
                  <option value="Modeling">Modeling</option>
                  <option value="Others">Others</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-black mb-2">Price (THB)</label>
              <input
                type="text"
                name="price"
                value={jobDetails.price}
                onChange={handleChange}
                placeholder="Enter price in Thai Baht"
                className="w-full p-3 border border-gray-300 rounded-lg text-black"
              />
            </div>

            <div className="mb-4">
              <label className="block text-black mb-2">Work Duration</label>
              <input
                type="text"
                name="duration"
                value={jobDetails.duration}
                onChange={handleChange}
                placeholder="e.g. 2 hours, 3 days"
                className="w-full p-3 border border-gray-300 rounded-lg text-black"
              />
            </div>

            <div className="mb-4">
              <label className="block text-black mb-2">Work Description</label>
              <textarea
                name="description"
                value={jobDetails.description}
                onChange={handleChange}
                placeholder="Describe the job details"
                className="w-full p-3 border border-gray-300 rounded-lg h-24 text-black"
              />
            </div>
          </div>

          <button
            onClick={handleNextPage}
            className="w-full bg-pink-500 text-white py-4 px-4 rounded-lg font-medium flex items-center justify-center
            transition-colors duration-200 ease-in-out hover:bg-pink-600 active:bg-pink-700"
          >
            <span>Next</span>
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </button>
        </div>
      {/* Pop-up Window */}
      <PopupWindow isVisible={isPopupVisible} onClose={handleClosePopup} />
    </div>
  );
};

export default CreateJobPreview;
