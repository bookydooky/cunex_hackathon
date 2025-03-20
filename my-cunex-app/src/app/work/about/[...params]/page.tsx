"use client";
import React, { useEffect, useState } from "react";
import { Users, Clock } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import WorkLayout from "../../../components/worklayout"; // Import WorkLayout

const WorkAbout = () => {
  const router = useRouter();
  const params = useParams();
  if (!params?.params) return <p>Loading...</p>;
  const [bannerId, userId] = params.params; // ✅ Get id dynamically  const router = useRouter();
  const [jobData, setJobData] = useState(null);
  const [freelanceData, setFreelanceData] = useState(null);

  useEffect(() => {
    if (!bannerId) return;

    const fetchJobDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/jobDetails/${bannerId}`
        );
        if (!response.ok) throw new Error("Failed to fetch job details");

        const data = await response.json();
        setJobData(data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchJobDetails();
  }, [bannerId]);
  useEffect(() => {
    console.log(jobData);
    if (!jobData?.userId) return;
    const fetchFreelanceDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/getFreelanceDetails/${jobData.userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch job details");

        const data = await response.json();
        setFreelanceData(data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchFreelanceDetails();
  }, [jobData]);

  if (!jobData || !freelanceData) return <p>Loading job details...</p>;
  function getAcademicYearLevel(entryYear, currentAcademicYear) {
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
  return (
    <WorkLayout jobData={jobData} userId={userId}>
      <div className="p-4">
        {/* View Full Profile Link */}
        <div className="text-right">
          <a
            href="#"
            className="text-Pink text-sm hover:underline hover:underline-offset-1"
          >
            View Full Profile
          </a>
        </div>

        {/* Profile Header */}
        <div className="flex items-center mt-2 mb-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden border-4 border-pink-400">
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              120 x 120
            </div>
          </div>
          <div className="ml-6">
            <h2 className="text-2xl text-Gray font-bold">
              {freelanceData.firstName} {freelanceData.lastName}
            </h2>
            <p className="text-gray-500">
              {getAcademicYearLevel(freelanceData.studentYear, 2567)},{" "}
              {freelanceData.facultyNameEN}
            </p>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-yellow-400 text-sm">
                  ★
                </span>
              ))}
              <span className="text-gray-500 text-sm ml-2">
                ({freelanceData.rating})
              </span>
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
              {freelanceData.successRate}%
            </div>
          </div>

          <div className="bg-pink-50 p-4 rounded-lg">
            <div className="flex items-center text-Pink mb-1">
              <Users size={16} className="mr-2" />
              <span className="text-sm text-Gray">Jobs Sold</span>
            </div>
            <div className="font-bold text-lg text-Gray">
              {freelanceData.jobsSold}
            </div>
          </div>

          <div className="bg-pink-50 p-4 rounded-lg">
            <div className="flex items-center text-Pink mb-1">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="mr-2 text-Pink"
              >
                <path d="M16 5v2a10 10 0 0 1-10 10h0c0-5.5 4.5-10 10-10h2m-2-2h7v7" />
              </svg>
              <span className="text-sm text-Gray">Rehired</span>
            </div>
            <div className="font-bold text-lg text-Gray">
              {freelanceData.rehired} times
            </div>
          </div>

          <div className="bg-pink-50 p-4 rounded-lg">
            <div className="flex items-center text-Pink mb-1">
              <Clock size={16} className="mr-2" />
              <span className="text-sm text-Gray">Avg. Response</span>
            </div>
            <div className="font-bold text-lg text-Gray">
              {freelanceData.avgResponse} hours
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mb-6">
          <h3 className="text-xl text-Gray font-bold mb-2">Bio</h3>
          <p className="text-gray-700">{freelanceData.bio}</p>
        </div>
      </div>
    </WorkLayout>
  );
};

export default WorkAbout;
