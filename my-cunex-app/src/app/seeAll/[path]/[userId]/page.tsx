"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Share2, MessageCircle } from "lucide-react";

export default function AllJobs({ params }: { params: { id: string } }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { path, userId } = useParams(); // ✅ Get both parameters
  useEffect(() => {
    async function fetchJobs() {
      try {
        const apiUrl =
          path === "None"
            ? "http://localhost:3001/api/latest-jobs"
            : `http://localhost:3001/api/latest-jobs?typeOfWork=${path}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        setJobs(data.jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  return (
    <div className="flex flex-col h-full bg-white mx-auto shadow-lg">
      {/* App Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b">
        <div className="flex items-center">
          <ArrowLeft
            className="mr-4 text-pink-500"
            onClick={() => router.back()}
          />
          <div className="flex items-center">
            <div className="font-bold text-lg">
              <span className="text-pink-500">CU</span>
              <span className="text-gray-700">NEX</span>
            </div>
            <div className="h-6 border-l border-gray-300 mx-3"></div>
            <div className="text-pink-500 text-xl font-medium">All Jobs</div>
          </div>
        </div>
        <Share2 className="text-gray-700" />
      </div>
      <div className="min-h-screen p-6 bg-gray-100">
        {loading ? (
          <p className="text-gray-500">Loading jobs...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {jobs.map((job) => (
              <div
                key={job.bannerId}
                className="bg-white shadow-lg rounded-lg p-3 cursor-pointer hover:shadow-xl transition"
                onClick={() =>
                  router.push(`/work/workdetail/${job.bannerId}/${userId}`)
                }
              >
                <img
                  src={job.imageURL || "https://via.placeholder.com/150"}
                  alt={job.bannerName}
                  className="w-full h-40 object-cover rounded-md"
                />
                <h2 className="text-lg text-black font-semibold mt-2">
                  {job.bannerName}
                </h2>
                <p className="text-gray-500 text-sm">{job.typeOfWork}</p>
                <p className="text-pink-500 font-bold">${job.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
