"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import WorkLayout from "../../../components/worklayout"; // Import WorkLayout
import ReloadWindow from "@/app/components/ReloadWindow";

interface Feedback {
  rating: number;
  detail: string;
  firstName: string;
  lastName: string;
  facultyNameEN: string;
  studentYear: string; // Adjust type based on the actual data type
}

const WorkFeedback = () => {
  const params = useParams();
  const [bannerId, userId] = params?.params || []; // ✅ Get id dynamically
  const [jobData, setJobData] = useState(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  useEffect(() => {
    if (!bannerId) return;

    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`/api/jobDetails/${bannerId}`);
        if (!response.ok) throw new Error("Failed to fetch job details");

        const data = await response.json();
        setJobData(data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch(`/api/getFeedbacks/${bannerId}`);
        if (!response.ok) throw new Error("Failed to fetch feedbacks");
        const data = await response.json();
        setFeedback(data);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchJobDetails();
    fetchFeedbacks();
  }, [bannerId]);

  if (!jobData) return <ReloadWindow detail="Job"/>;
  const overallRating =
    feedback.length > 0
      ? feedback
          .map((f) => Number(f.rating)) // Convert to number explicitly
          .filter((r) => !isNaN(r) && r !== null && r !== undefined) // Remove invalid ratings
          .reduce((sum, r, _, arr) => sum + r / arr.length, 0)
          .toFixed(1)
      : null;

  // Function to render stars with half-star support
  const renderStars = (rating: number) => {
    if (rating === null) return <p className="text-gray-500">No Ratings</p>; // ✅ Handle no ratings case
    console.log("overallRating:", overallRating);
    const roundedRating = Math.round(rating * 2) / 2;
    console.log("Rating:", roundedRating);

    const fullStars = Math.floor(roundedRating);
    const hasHalfStar = roundedRating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    console.log(hasHalfStar, fullStars, emptyStars);
    return (
      <div className="flex">
        {Array(fullStars)
          .fill("★") // Fill with the full star
          .map((star, i) => (
            <span key={i} className="text-yellow-400 text-xl">
              {star}
            </span>
          ))}
        {hasHalfStar && (
          <div className="relative inline-block">
            <span
              className="absolute left-0 top-0 overflow-hidden"
              style={{ width: "50%" }}
            >
              <span className="text-yellow-400 text-xl">★</span>
            </span>
            <span className="text-gray-300 text-xl">★</span>
          </div>
        )}
        {Array(emptyStars)
          .fill("★") // Fill with the empty star
          .map((star, i) => (
            <span key={`empty-${i}`} className="text-gray-300 text-xl">
              {star}
            </span>
          ))}
      </div>
    );
  };

  return (
    <WorkLayout jobData={jobData} userId={userId}>
      <div className="flex flex-col p-4">
        {/* Overall Rating */}
        <div className="flex items-center mb-6">
          <h2 className="text-xl text-gray-700 font-semibold mr-3">
            {overallRating !== null ? overallRating : "No Ratings"}
          </h2>
          {renderStars(overallRating as any)}
          <span className="text-gray-500 ml-2">
            ({feedback.length} {feedback.length === 1 ? "review" : "reviews"})
          </span>
        </div>

        {/* Review Cards */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {feedback.length > 0 ? (
            feedback.map((review, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between mb-1">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {review.firstName} {review.lastName}
                    </h3>
                    <p className="text-gray-500">{review.facultyNameEN}</p>
                  </div>
                  {renderStars(review.rating)}
                </div>
                <p className="italic text-gray-700 text-sm">{review.detail}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No feedback available yet.</p> // ✅ Handle empty feedback array correctly
          )}
        </div>
      </div>
    </WorkLayout>
  );
};

export default WorkFeedback;
