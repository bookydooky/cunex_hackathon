"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import moment from "moment";
export default function MyJobsPage() {
  const [activeTab, setActiveTab] = useState("ongoing");
  const router = useRouter();
  const [ongoingJobs, setOngoingJobs] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const getOngoingJobs = async () => {
    const session = {
      userId: "100000000000000001",
    };

    try {
      const response = await fetch(
        `http://localhost:3001/getOngoingJobs?userId=${session.userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      console.log("Server response:", result);
      setOngoingJobs(result.jobs);
      return result; // Return the result to get the bannerId
    } catch (error) {
      console.error("Error Finding Ongoing Jobs", error);
      throw error; // Re-throw to handle in the calling function
    }
  };
  const getCompletedJobs = async () => {
    const session = {
      userId: "100000000000000001",
    };

    try {
      const response = await fetch(
        `http://localhost:3001/getCompletedJobs?userId=${session.userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      console.log("Server response:", result);
      setCompletedJobs(result.jobs);
      return result; // Return the result to get the bannerId
    } catch (error) {
      console.error("Error Finding Ongoing Jobs", error);
      throw error; // Re-throw to handle in the calling function
    }
  };
  useEffect(() => {
    getOngoingJobs();
    getCompletedJobs();
  }, []);

  return (
    <div className="bg-gray-100 h-screen overflow-y-auto">
      <div className="sticky top-0 left-0 right-0">
        {/* Navigation bar */}
        <div className="px-4 py-2 flex justify-between items-center bg-white">
          <div className="flex items-center">
            <button
              onClick={() => router.push("/profile")}
              className="transition-transform transform active:scale-90"
            >
              <ArrowLeft className="mr-4 text-pink-500 hover:text-pink-800" />
            </button>
            <img src="/assets/CUNEX-logo.png" alt="CUNEX Logo" className="h-12" />
            <div className="h-6 border-l border-gray-300 mx-5"></div>
            <div className="text-pink-500 font-medium text-xl">Profile</div>
          </div>
          <Share2 className="text-black" />
        </div>

        {/* Tabs */}
        <div className="bg-white flex mb-4 shadow-sm">
          <button
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === "ongoing"
                ? "text-pink-500 border-b-2 border-pink-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("ongoing")}
          >
            Ongoing
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === "completed"
                ? "text-pink-500 border-b-2 border-pink-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
        </div>
      </div>
      {/* Job List */}
      <div className="mx-4">
        {activeTab === "ongoing" && (
          <>
            {ongoingJobs.map((job) => (
              <div
                key={job.historyId}
                className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="font-semibold text-black">
                      {job.bannerName}
                    </h2>
                    <span className="text-pink-500 font-medium">
                      {job.price}
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm mb-1">
                    Client: {job.firstName} {job.lastName}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Start Date: {moment(job.dateSold).format("MM/DD/YYYY")}
                  </p>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-gray-500 text-sm">
                      Duration: {job.duration}
                    </p>
                    <span className="text-sm">{job.progress * 33.33}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        job.accept === null
                          ? "bg-blue-500"
                          : job.accept === 0
                          ? "bg-red-500"
                          : "bg-pink-500"
                      }`}
                      style={{ width: `${job.progress * 33.33}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex border-t border-gray-100">
                  <button className="flex-1 py-3 text-center border-r border-gray-100 text-gray-500">
                    Message
                  </button>

                  <button className="flex-1 py-3 text-center text-pink-500 font-medium">
                    <Link href={`/profile/myJob/upload/${job.historyId}`}>
                      Update
                    </Link>
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === "completed" && (
          <>
            {completedJobs.map((job) => (
              <div
                key={job.historyId}
                className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="font-semibold text-black">
                      {job.bannerName}
                    </h2>
                    <span className="text-pink-500 font-medium">
                      {job.price}
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm mb-1">
                    Client: {job.firstName} {job.lastName}
                  </p>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-gray-500 text-sm">
                      Duration: {job.duration}
                    </p>
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-yellow-400 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm">5.0</span>
                    </div>
                  </div>

                  {/* Completed indicator */}
                  <div
                    className={`inline-block text-xs py-1 px-2 rounded-full ${
                      job.accept === 1
                        ? "bg-green-100 text-green-600" // Completed
                        : "bg-red-100 text-red-600" // Failed
                    }`}
                  >
                    {job.accept === 1 ? "Completed" : "Failed"}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex border-t border-gray-100">
                  <button className="flex-1 py-3 text-center border-r border-gray-100 text-gray-500">
                    View Details
                  </button>
                  <button className="flex-1 py-3 text-center text-gray-500">
                    Archive
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
