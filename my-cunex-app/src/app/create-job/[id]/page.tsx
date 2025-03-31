"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Users, Clock, XCircle, RotateCcw } from "lucide-react";
import Image from "next/image";
import PopupWindow from "../../components/CollaborateWindow";
import ReloadWindow from "@/app/components/ReloadWindow";

interface UserProfileResponse {
  firstName: string;
  lastName: string;
  facultyCode: string;
  studentYear: string;
  facultyNameEN: string;
  studentId: string;
  successRate: number;
  jobsSold: number;
  rehired: number;
  avgResponse: number;
  bio: string;
  rating: number;
  phoneNumber: string;
  profileImageUrl: string;
  bank: string;
  accountNumber: string;
}

const CreateJobPreview = () => {
  const router = useRouter();
  const params = useParams();
  const userId = params.id;
  const [userData, setUserData] = useState<UserProfileResponse | null>(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchUserDetail = async () => {
      try {
        const response = await fetch(`/api/getProfile/?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch job details");

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchUserDetail();
  }, [userId]);

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
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

  if (!userData) return <ReloadWindow detail="User" />;
  const handleNextPage = () => {
    if (!userData.phoneNumber) {
      setIsAlertVisible(true);
      return;
    }
    localStorage.setItem("jobDetails", JSON.stringify(jobDetails));
    console.log("Saved to localStorage:", jobDetails);
    router.push(`/portfolio/${userId}`);
  };
  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-y-auto">
      {/* App Header */}
      <div className="sticky top-0 left-0 right-0 px-4 py-2 flex items-center justify-between bg-white z-1">
        <div className="flex items-center">
          <button
            onClick={handlePreviousPage}
            className="transition-transform transform active:scale-90"
          >
            <ArrowLeft className="mr-4 text-Pink hover:text-darkPink active:text-darkPink" />
          </button>
          <div className="flex items-center">
            <Image
              src="/assets/CUNEX-logo.png"
              alt="CUNEX Logo"
              width={48}
              height={48}
              className="h-12"
            />
            <div className="h-6 border-l border-gray-300 mx-5"></div>
            <div className="text-Pink text-xl font-medium">Create Job</div>
          </div>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="flex px-4 mt-4">
        <div className="h-1 bg-Pink flex-1 rounded-full mr-2"></div>
        <div className="h-1 bg-gray-200 flex-1 rounded-full ml-2"></div>
      </div>

      <div className="flex-1 p-4">
        {/* User Profile Section */}
        <div className="bg-white p-4 rounded-lg mb-8">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center relative">
              {userData.profileImageUrl ? (
                <Image src={userData.profileImageUrl} 
                alt="Profile Image"
                fill={true}
                objectFit="cover"
                className="rounded-full"/>
                ) : (
              <Users size={28} className="text-Pink" />
                )}
            </div>
            <div className="ml-4">
              <div className="font-bold text-xl text-Gray">
                {userData.firstName} {userData.lastName}
              </div>
              <div className="flex items-center">
                <div className="text-yellow-400">★</div>
                <div className="ml-1 font-medium text-Gray">
                  {userData.rating}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-pink-50 p-4 rounded-lg">
              <div className="flex items-center text-Pink mb-1">
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
                <span className="text-sm text-Gray">Success Rate</span>
              </div>
              <div className="font-bold text-lg text-Gray">
                {userData.successRate}%
              </div>
            </div>

            <div className="bg-pink-50 p-4 rounded-lg">
              <div className="flex items-center text-Pink mb-1">
                <Users size={16} className="mr-2" />
                <span className="text-sm text-Gray">Jobs Sold</span>
              </div>
              <div className="font-bold text-lg text-Gray">
                {userData.jobsSold}
              </div>
            </div>

            <div className="bg-pink-50 p-4 rounded-lg">
              <div className="flex items-center text-Pink mb-1">
                <RotateCcw size={16} className="mr-2"/>
                <span className="text-sm text-Gray">Rehired</span>
              </div>
              <div className="font-bold text-lg text-Gray">
                {userData.rehired} times
              </div>
            </div>

            <div className="bg-pink-50 p-4 rounded-lg">
              <div className="flex items-center text-Pink mb-1">
                <Clock size={16} className="mr-2" />
                <span className="text-sm text-Gray">Avg. Response</span>
              </div>
              <div className="font-bold text-lg text-Gray">
                {userData.avgResponse} hours
              </div>
            </div>
          </div>
        </div>

        {/* Job Details Form */}
        <div className="bg-white p-4 rounded-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-Gray">Job Details</h2>
            <button
              onClick={handleCollaborateClick}
              className="mr-2 transition-transform transform active:scale-90"
            >
              <Users
                size={25}
                className="text-Pink hover:text-darkPink active:text-darkPink"
              />
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-Gray mb-2">Work Title</label>
            <input
              type="text"
              name="workTitle"
              value={jobDetails.workTitle}
              onChange={handleChange}
              placeholder="Enter the title of the work"
              className="w-full p-3 border border-gray-300 rounded-lg text-black
              focus:border-Pink focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-Gray mb-2">Type of Work</label>
            <div className="relative">
              <select
                name="workType"
                value={jobDetails.workType}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg appearance-none text-black
                focus:border-Pink focus:outline-none"
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
                  className="w-4 h-4 text-Gray"
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
            <label className="block text-Gray mb-2">Price (THB)</label>
            <input
              type="text"
              name="price"
              value={jobDetails.price}
              onChange={handleChange}
              placeholder="Enter price in Thai Baht"
              className="w-full p-3 border border-gray-300 rounded-lg text-black
              focus:border-Pink focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-Gray mb-2">Work Duration</label>
            <input
              type="text"
              name="duration"
              value={jobDetails.duration}
              onChange={handleChange}
              placeholder="e.g. 2 hours, 3 days"
              className="w-full p-3 border border-gray-300 rounded-lg text-black
              focus:border-Pink focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-Gray mb-2">Work Description</label>
            <textarea
              name="description"
              value={jobDetails.description}
              onChange={handleChange}
              placeholder="Describe the job details"
              className="w-full p-3 border border-gray-300 rounded-lg h-24 text-black
              focus:border-Pink focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-Gray mb-2">Tools</label>
            <input
              type="text"
              name="tools"
              value={jobDetails.workTitle}
              onChange={handleChange}
              placeholder="Add tools (e.g., Figma)"
              className="w-full p-3 border border-gray-300 rounded-lg text-black
              focus:border-Pink focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleNextPage}
          className="w-full bg-Pink text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center
            transition-colors duration-200 ease-in-out hover:bg-darkPink active:bg-darkPink"
        >
          <span>Next</span>
        </button>
      </div>
      {isAlertVisible && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-white/30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
            <XCircle className="mx-auto text-red-500 mb-2" size={40} />
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Please insert your Bank Account and PromptPay details in the
              Profile page
            </h2>
            <button
              onClick={() => setIsAlertVisible(false)}
              className="bg-Pink text-white px-4 py-2 rounded-lg hover:bg-darkPink"
            >
              OK
            </button>
          </div>
        </div>
      )}
      {/* Pop-up Window */}
      <PopupWindow isVisible={isPopupVisible} onClose={handleClosePopup} />
    </div>
  );
};

export default CreateJobPreview;
