"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft, Share2, MessageSquare } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function MessagePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [acceptedJobs, setAcceptedJobs] = useState<Job[]>([]);
  const router = useRouter();
  const params = useParams();
  const userId = String(params.colabid);

  interface Job {
    bannerId: string;
    bannerName: string;
    price: string;
    firstName: string;
    lastName: string;
    duration: string;
    Id: string;
    confirmed: boolean;
    confirmedOrg: boolean | null;
  }

  const getCollaborations = async () => {
    try {
      const response = await fetch(`/api/getCollaborations?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      console.log("Server response:", result);
      setJobs(result);

      // Filter jobs where confirmed is true
      const accepted = result.filter((job: Job) => job.confirmed === true);
      setAcceptedJobs(accepted);
    } catch (error) {
      console.error("Error Finding Ongoing Jobs", error);
    }
  };

  useEffect(() => {
    getCollaborations();
    console.log(jobs);
  }, [userId]);

  const handleDeny = async (userId: string, bannerId: string) => {
    try {
      const response = await fetch("/api/denyColab", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, bannerId }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to deny collaboration");
      }

      console.log("Collaboration denied successfully:", result);
      setJobs((prevJobs) =>
        prevJobs.filter((job) => job.bannerId !== bannerId)
      );
    } catch (error) {
      console.error("Error denying collaboration:", error);
    }
  };

  const handleAccept = async (userId: string, bannerId: string) => {
    try {
      const response = await fetch("/api/acceptColab", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, bannerId }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to accept collaboration");
      }

      console.log("Collaboration Accepted successfully:", result);
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.bannerId === bannerId ? { ...job, confirmed: true } : job
        )
      );
    } catch (error) {
      console.error("Error accepting collaboration:", error);
    }
  };

  return (
    <div className="bg-gray-100 h-screen overflow-y-auto">
      <div className="sticky top-0 left-0 right-0">
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
            <div className="text-pink-500 font-medium text-xl">Team ups</div>
          </div>
          <Share2 className="text-gray-500" />
        </div>
      </div>

      <div className="mx-4 mt-4">
        {jobs.map((job) => (
          <div
            key={`${job.bannerId}-${userId}`}
            className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden"
          >
            {job.confirmedOrg ? (
              <div className="p-4 text-center text-gray-600 font-medium">
                You have been added as a cooperator for job {job.bannerName},
                wait for the job owner to message you
              </div>
            ) : job.confirmed ? (
              <div className="p-4 text-center text-gray-600 font-medium">
                Job request submitted, wait for result
              </div>
            ) : (
              <>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="font-semibold text-gray-700">
                      {job.bannerName}
                    </h2>
                    <span className="text-pink-500 font-medium">
                      {job.price}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-1">
                    Job Owner: {job.firstName} {job.lastName}
                  </p>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-gray-500 text-sm">
                      Duration: {job.duration}
                    </p>
                  </div>
                </div>

                <div className="flex border-t border-gray-100">
                  <button className="w-full py-3 text-center text-gray-700 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100">
                    <MessageSquare className="w-5 h-5 mr-2 text-pink-500" />
                    Message
                  </button>
                </div>
                <div className="flex border-t border-gray-100">
                  <button
                    className="w-1/2 py-3 text-center text-green-600 font-medium hover:bg-green-50 active:bg-green-100"
                    onClick={() => handleAccept(userId, job.bannerId)}
                  >
                    Submit
                  </button>
                  <button
                    className="w-1/2 py-3 text-center text-red-600 font-medium hover:bg-red-50 active:bg-red-100"
                    onClick={() => handleDeny(userId, job.bannerId)}
                  >
                    Deny
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
