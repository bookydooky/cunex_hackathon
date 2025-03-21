"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft, Share2, MessageSquare } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function UsersPage() {
  const router = useRouter();
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

  interface User {
    userId: string;
    firstName: string;
    lastName: string;
    studentId: string;
    facultyNameEN: string;
    studentYear: string;
    workTypes: string[];
    lineId: string; // Assuming this data is available
    confirmedOrg?: boolean; // Assuming confirmedOrg is a boolean field indicating whether the user is accepted
  }

  const [users, setUsers] = useState<User[]>([]);
  const [acceptedUserId, setAcceptedUserId] = useState<string | null>(null); // Track accepted user
  const params = useParams();
  const bannerId = String(params.uid); // Assuming bannerId is passed as part of the URL params

  const getUsersDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/getUserDetailsFromColab?bannerId=${bannerId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      console.log("Server response:", result);
      if (result.error === "No user found for the specified bannerId") {
        setUsers([]);
      } else {
        setUsers(result);
      }

      if (result.error !== "No user found for the specified bannerId") {
        // Automatically set the acceptedUserId based on the confirmedOrg field for each user
        const acceptedUser = result.find((user: User) => user.confirmedOrg);
        if (acceptedUser) {
          setAcceptedUserId(acceptedUser.userId); // Set acceptedUserId if any user has confirmedOrg true
        }
      }
    } catch (error) {
      console.error("Error fetching user details", error);
    }
  };

  useEffect(() => {
    getUsersDetails();
  }, [bannerId]);

  const handleAccept = async (userId: string, bannerId: string) => {
    try {
      // Make a POST request to accept the user
      const response = await fetch(
        "http://localhost:3001/acceptColabFromOwner",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, bannerId }), // Sending userId in the request body
        }
      );

      if (!response.ok) {
        throw new Error("Failed to accept user");
      }

      // If the request was successful, update the acceptedUserId
      setAcceptedUserId(userId);
      console.log("User accepted:", userId);
    } catch (error) {
      console.error("Error during accept request:", error);
    }
  };
  const handleDeny = async (userId: string, bannerId: string) => {
    try {
      // Make a POST request to deny the user
      const response = await fetch("http://localhost:3001/denyColabFromOwner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, bannerId }), // Sending userId in the request body
      });

      if (!response.ok) {
        throw new Error("Failed to deny user");
      }

      // Remove the denied user from the state
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.userId !== userId)
      );
      console.log("User denied:", userId);
    } catch (error) {
      console.error("Error during deny request:", error);
    }
  };

  if (!users || users.length === 0) return <p>Still Finding Teammates</p>;
  //   if (users.error === "No user found for the specified bannerId")
  //     return <p>Still Finding Teammates...</p>;
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

      {/* User List */}
      <div className="mx-4 mt-4">
        {users.map((user) => (
          <div
            key={user.userId}
            className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h2 className="font-semibold text-gray-700">
                  {user.firstName} {user.lastName}
                </h2>
                <span className="text-pink-500 font-medium">
                  {user.studentId}
                </span>
              </div>

              <div className="flex justify-between items-center mb-3">
                <p className="text-gray-500 text-sm">
                  Faculty: {user.facultyNameEN}
                </p>
                <p className="text-gray-500 text-sm">
                  Year :{" "}
                  {getAcademicYearLevel(parseInt(user.studentYear, 10), 2567)}
                </p>
              </div>

              <div className="mb-3">
                <h3 className="text-gray-600">Skills:</h3>
                <ul className="list-disc pl-5 text-sm text-gray-500">
                  {user.workTypes.map((work, index) => (
                    <li key={index}>{work}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Accept/deny button or Line ID display */}
            <div className="flex border-t border-gray-100">
              {acceptedUserId === user.userId ? (
                // If the user has been accepted, show the Line ID
                <div className="w-full py-3 text-center text-gray-700 font-medium">
                  Line ID: {user.lineId}
                </div>
              ) : (
                <>
                  <button
                    className="w-1/2 py-3 text-center text-red-600 font-medium hover:bg-red-50 active:bg-red-100"
                    onClick={() => handleDeny(user.userId, bannerId)} // Implement Deny functionality if needed
                  >
                    Deny
                  </button>
                  <button
                    className="w-1/2 py-3 text-center text-green-600 font-medium hover:bg-green-50 active:bg-green-100"
                    onClick={() => handleAccept(user.userId, bannerId)} // Handle accept
                  >
                    Accept
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
