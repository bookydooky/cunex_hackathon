"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Users, CheckCircle, UserPlus } from "lucide-react"; // Import the required icons
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

export default function ProfilePage() {
  interface UserProfile {
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
  }
  function getAcademicYearLevel(
    entryYear: number,
    currentAcademicYear: number
  ) {
    // Calculate the difference between current academic year and entry year
    const yearDifference = currentAcademicYear - entryYear;

    // Determine year level based on the difference
    if (yearDifference < 0) {
      return "Not yet enrolled";
    } else if (yearDifference === 0) {
      return "1st year";
    } else if (yearDifference === 1) {
      return "2nd year";
    } else if (yearDifference === 2) {
      return "3rd year";
    } else if (yearDifference === 3) {
      return "4th year";
    } else if (yearDifference === 4) {
      return "5th year";
    } else if (yearDifference > 4) {
      return "Advanced year / Graduate";
    }
  }

  const router = useRouter();
  const params = useParams();
  const userId = String(params.id); // ✅ Get id dynamically  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null); // Explicitly set type

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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a FileReader to convert the file to a data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
        // Set the data URL as the selectedFile
        setSelectedFile(file);
      };
      reader.readAsDataURL(file);
    }
  };
  const sendToServer = async (fileUrls: string[], userId: string) => {
    console.log("Profile of user: ", userId);
    try {
      const response = await fetch("/api/addProfileImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ images: fileUrls, userId }), // Use the passed bannerId
      });

      const result = await response.json();
      console.log("Server response:", result);
    } catch (error) {
      console.error("Error sending files to server:", error);
    }
  };
  const handleFileSubmit = async () => {
    if (!selectedFile) {
      alert("Please select an image before submitting.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("files", selectedFile); // Append the single file

      const response = await fetch("/api/s3-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const { fileUrls } = await response.json();
      console.log("Uploaded file:", fileUrls);

      // Send fileUrls to your Node.js server (server.js)
      await sendToServer(fileUrls, userId); // Pass bannerId here
      router.push("/");
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setSelectedFile(null); // Clear file after upload
    }
  };

  const handleSubmit = () => {
    console.log("Profile picture uploaded:", selectedFile);
    handleFileSubmit();
    setShowModal(false);
  };
  if (!userData) return <p>Loading user details...</p>;

  return (
    <div className="h-screen bg-gray-100 overflow-y-auto">
      {/* Navigation bar */}
      <div className="sticky top-0 right-0 left-0 px-4 py-2 flex justify-between items-center bg-white">
        <div className="flex items-center">
          <button
            onClick={() => router.push("/")}
            className="transition-transform transform active:scale-90"
          >
            <ArrowLeft className="mr-4 text-Pink hover:text-darkPink active:text-darkPink" />
          </button>
          <Image
            src="/assets/CUNEX-logo.png"
            alt="CUNEX Logo"
            width={48}
            height={48}
            className="h-12"
          />
          <div className="h-6 border-l border-gray-300 mx-5"></div>
          <div className="text-Pink font-medium text-xl">Profile</div>
        </div>
      </div>

      {/* Profile summary */}
      <div className="bg-white mx-4 mt-4 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 flex w-full items-center justify-center gap-x-5">
          {/* Profile image */}
          {userData.profileImageUrl ? (
            <Image
              src={userData.profileImageUrl}
              alt="Profile Picture"
              width={120}
              height={120}
              className="w-30 h-30 rounded-full object-cover"
            />
          ) : (
            <div className="w-30 h-30 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-300"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}

          {/* Profile info */}
          <div className="flex flex-col items-start">
            <h2 className="font-bold text-Gray text-xl">
              {userData.firstName} {userData.lastName}
            </h2>
            <p className="text-gray-500 text-sm">
              {getAcademicYearLevel(parseInt(userData.studentYear, 10), 2567)}
            </p>
            <p className="text-gray-500 text-sm">
              Faculty: {userData.facultyNameEN}
            </p>
            <p className="text-gray-500 text-sm">ID: {userData.studentId}</p>
            <div className="mt-2 flex justify-center">
              <button
                onClick={() => setShowModal(true)}
                className="border border-Pink text-Pink rounded-full px-6 py-1 w-50 text-[10px]"
              >
                Edit Profile Picture
              </button>
            </div>
          </div>
          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
              <div className="bg-white rounded-xl shadow-2xl w-[450px] p-8 text-center relative">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                  Upload Profile Picture
                </h2>

                <label
                  htmlFor="file-upload"
                  className="mx-auto w-48 h-48 mb-6 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-pink-500 transition-all duration-300"
                >
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt="Profile Preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-sm">Click to upload</span>
                    </div>
                  )}
                </label>

                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex border-t border-gray-100">
          <div className="flex-1 py-3 text-center border-r border-gray-100">
            <p className="font-bold text-xl text-Gray">{userData.jobsSold}</p>
            <p className="text-gray-500 text-xs">Completed</p>
          </div>
          <div className="flex-1 py-3 text-center border-r border-gray-100">
            <p className="font-bold text-xl text-Gray">
              {userData.successRate} %
            </p>
            <p className="text-gray-500 text-xs">Success Rate</p>
          </div>
          <div className="flex-1 py-3 text-center">
            <p className="font-bold text-xl text-Gray">{userData.rating}</p>
            <p className="text-gray-500 text-xs">Rating</p>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="mx-4 mt-4">
        {/* My Jobs */}
        <div
          className="bg-white rounded-lg mb-3 shadow-sm hover:bg-gray-100
          transition-colors active:bg-gray-200"
        >
          <Link href={`/profile/${userId}/myJob/${userId}`}>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                  <CheckCircle className="text-Pink w-[20px] h-[20px]" />
                </div>
                <span className="text-Gray">My Jobs</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </Link>
        </div>
        {/* My Team */}
        <div
          className="bg-white rounded-lg mb-3 shadow-sm hover:bg-gray-100
          transition-colors active:bg-gray-200"
        >
          <Link href={`/profile/${userId}/myTeam/${userId}`}>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                  <Users className="text-Pink w-[20px] h-[20px]" />
                </div>
                <span className="text-Gray">My Team</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </Link>
        </div>
        {/* Team up Requests */}
        <div
          className="bg-white rounded-lg mb-3 shadow-sm hover:bg-gray-100
      transition-colors active:bg-gray-200"
        >
          <Link href={`/profile/${userId}/colab/${userId}`}>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                  <UserPlus className="text-Pink w-[20px] h-[20px]" />
                </div>
                <span className="text-Gray">Team Up Requests</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </Link>
        </div>
        {/* Payments */}
        <div
          className="bg-white rounded-lg mb-3 shadow-sm hover:bg-gray-100
    transition-colors active:bg-gray-200"
        >
          <Link href={`/profile/${userId}/payments/${userId}`}>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                  <span className="text-Pink w-[20px] h-[20px]">💸</span>
                </div>
                <span className="text-Gray">Payments</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
