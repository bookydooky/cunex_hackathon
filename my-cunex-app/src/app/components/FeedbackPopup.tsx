"use client";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

interface FeedbackPopupProps {
  setShowFeedbackPopup: React.Dispatch<React.SetStateAction<boolean>>;
  clickedBannerId: string; // Assuming bannerId is passed as a prop to the component
}

const FeedbackPopup: React.FC<FeedbackPopupProps> = ({
  setShowFeedbackPopup,
  clickedBannerId,
}) => {
  const userId = localStorage.getItem("userId");
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  // Function to submit feedback
  const submitFeedback = async () => {
    if (feedback.trim() === "") {
      alert("Please provide feedback before submitting.");
      return;
    }
    console.log("BannerId", clickedBannerId);
    console.log("rating", rating);
    const payload = {
      clickedBannerId,
      userId,
      feedback,
      rating,
    };

    try {
      const response = await fetch("/api/submitFeedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Feedback submitted successfully!");
        setShowFeedbackPopup(false);
      } else {
        alert("Failed to submit feedback. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting feedback. Please try again later.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-black">
        <h2 className="text-xl font-semibold mb-4">Write Your Feedback</h2>

        {/* Rating Stars */}
        <div className="flex justify-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`cursor-pointer text-3xl ${
                star <= rating ? "text-yellow-500" : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        {/* Feedback Textarea */}
        <textarea
          className="w-full h-32 border p-2 rounded-md text-black"
          placeholder="Write your feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        ></textarea>

        {/* Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            className="flex-1 bg-gray-100 text-gray-400 px-4 py-2 rounded-lg
            hover:bg-gray-200 active:bg-gray-200 transition-colors"
            onClick={() => setShowFeedbackPopup(false)}
          >
            Skip
          </button>
          <button
            className="flex-1 bg-Pink text-white px-4 py-2 rounded-lg
            hover:bg-darkPink active:bg-darkPink transition-colors"
            onClick={submitFeedback}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPopup;
