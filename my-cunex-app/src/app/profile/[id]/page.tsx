"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Share2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function ProfilePage() {
  interface UserProfile {
    firstName: string;
    lastName: string;
    facultyCode: string;
    studentYear: string;
    facultyNameEN: string;
    studentId: string;
    successRate?: number;
    jobsSold?: number;
    rehired?: number;
    avgResponse?: number;
    bio?: string;
    rating?: number;
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
  const userId = params.id; // ✅ Get id dynamically  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  useEffect(() => {
    if (!userId) return;

    const fetchUserDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/getProfile/?userId=${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch job details");

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchUserDetail();
  }, [userId]);
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
            <ArrowLeft className="mr-4 text-Pink hover:text-darkPink" />
          </button>
          <img src="/assets/CUNEX-logo.png" alt="CUNEX Logo" className="h-12" />
          <div className="h-6 border-l border-gray-300 mx-5"></div>
          <div className="text-Pink font-medium text-xl">Profile</div>
        </div>
        <Share2 className="text-Gray" />
      </div>

      {/* Profile summary */}
      <div className="bg-white mx-4 mt-4 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 flex w-full items-center justify-center gap-x-5">
          {/* Profile image */}
          <div className="w-30 h-30 bg-gray-100 rounded-full flex items-center justify-center mr-4">
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
              <button className="border border-Pink text-Pink rounded-full px-6 py-1 w-50 text-sm">
                Edit Profile
              </button>
            </div>
          </div>
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
      transition-colors active:bg-gray-200 transition-transform transform active:scale-95"
        >
          <Link href={`/profile/${userId}/myJob/${userId}`}>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                  <span className="text-Pink text-sm">+</span>
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
        {/* Team up Requests*/}
        <div
          className="bg-white rounded-lg mb-3 shadow-sm hover:bg-gray-100
      transition-colors active:bg-gray-200 transition-transform transform active:scale-95"
        >
          <Link href={`/profile/${userId}/colab/${userId}`}>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                  <span className="text-Pink text-sm">+</span>
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
        <div
          className="bg-white rounded-lg mb-3 shadow-sm hover:bg-gray-100
      transition-colors active:bg-gray-200 transition-transform transform active:scale-95"
        >
          <Link href={`/profile/${userId}/myTeam/${userId}`}>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                  <span className="text-Pink text-sm">+</span>
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
        {/* Payment Methods */}
        <div className="bg-white rounded-lg mb-3 shadow-sm">
          <Link href="/payment-methods">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                  <span className="text-Pink text-sm">−</span>
                </div>
                <span className="text-Gray">Payment Methods</span>
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
        {/* Order History */}
        <div className="bg-white rounded-lg mb-3 shadow-sm">
          <Link href="/order-history">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                  <span className="text-Pink text-sm">×</span>
                </div>
                <span className="text-Gray">Order History</span>
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
        {/* Settings */}
        <div className="bg-white rounded-lg mb-3 shadow-sm">
          <Link href="/settings">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                  <span className="text-Pink text-sm">◯</span>
                </div>
                <span className="text-Gray">Settings</span>
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
