"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft, Share2, MessageSquare } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
export default function MessagePage() {
  interface Job {
    bannerId: string;
    bannerName: string;
    price: number;
    duration: number;
    typeOfWork: string;
  }

  const [jobs, setJobs] = useState<Job[]>([]);
  const params = useParams();
  const userId = String(params.teamid);

  const getCollaborations = async () => {
    try {
      const response = await fetch(
        `/api/getBannersFromColabs?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      console.log("Server response:", result);
      setJobs(result);
    } catch (error) {
      console.error("Error Finding Ongoing Jobs", error);
    }
  };

  useEffect(() => {
    getCollaborations();
  }, [userId]);

  // Router would be used in a real implementation
  const router = useRouter();

  if (!jobs || jobs.length === 0) return <p>Loading user details...</p>;

  return (
    <div className="bg-gray-100 h-screen overflow-y-auto">
      <div className="sticky top-0 left-0 right-0">
        {/* Navigation bar */}
        <div className="px-4 py-2 flex justify-between items-center bg-white">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="transition-transform transform active:scale-90"
            >
              <ArrowLeft className="mr-4 text-pink-500 hover:text-pink-700" />
            </button>
            <img
              src="/assets/CUNEX-logo.png"
              alt="CUNEX Logo"
              className="h-12"
            />
            <div className="h-6 border-l border-gray-300 mx-5"></div>
            <div className="text-pink-500 font-medium text-xl">My Team</div>
          </div>
          <Share2 className="text-gray-500" />
        </div>
      </div>

      {/* Message List */}
      <div className="mx-4 mt-4">
        {jobs.map((job) => (
          <div
            key={job.bannerId}
            className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h2 className="font-semibold text-gray-700">
                  {job.bannerName}
                </h2>
                <span className="text-pink-500 font-medium">${job.price}</span>
              </div>

              <div className="flex justify-between items-center mb-3">
                <p className="text-gray-500 text-sm">
                  Duration: {job.duration} days
                </p>
                <p className="text-gray-500 text-sm">
                  Work Type: {job.typeOfWork}
                </p>
              </div>
            </div>

            {/* Message button */}
            <div className="flex border-t border-gray-100">
              <button className="w-full py-3 text-center text-gray-700 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100">
                <Link
                  href={`/profile/${userId}/myTeam/${userId}/checkTeam/${job.bannerId}`}
                >
                  Check Teammates
                </Link>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
