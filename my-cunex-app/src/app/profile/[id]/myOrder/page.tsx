"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import moment from "moment";
import Image from "next/image";

export default function MyOrdersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('');
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
              <ArrowLeft className="mr-4 text-Pink hover:text-darkPink" />
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

        {/* Tabs */}
        <div className="bg-white flex mb-4 shadow-sm">
          <button
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === "ongoing"
                ? "text-Pink border-b-2 border-Pink"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("ongoing")}
          >
            Ongoing
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === "completed"
                ? "text-Pink border-b-2 border-Pink"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
        </div>
      </div>
      {/* Job List */}
      {isLoading ? (
        <p className="text-gray-500 pl-4">Loading Jobs...</p>
      ) : (
        <div className="mx-4">
          {activeTab === "ongoing" && (
            <>
              <div className="pb-2">
                <h1 className="text-Pink text-2xl font-semibold">My Jobs</h1>
                {ongoingJobs.length == 0 && <p className="text-gray-500">No current ongoing jobs</p>}
              </div>
              {ongoingJobs.map((job) => (
                <div
                  key={job.historyId}
                  className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="font-semibold text-xl text-Gray">
                        {job.bannerName}
                      </h2>
                      <span className="text-Pink font-medium">{job.price}</span>
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
                            : "bg-Pink"
                        }`}
                        style={{ width: `${job.progress * 33.33}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex border-t border-gray-100">
                    <button
                      className="flex-1 py-3 text-center border-r border-gray-100 text-gray-500"
                      onClick={() => router.push("/chatpage")}
                    >
                      Message
                    </button>

                    <button
                      className="flex-1 py-3 text-center text-Pink font-medium
                  hover:underline active:text-darkPink"
                    >
                      <Link
                        href={`/profile/${userId}/myJob/${userId}/upload/${job.historyId}`}
                      >
                        Update
                      </Link>
                    </button>
                  </div>
                </div>
              ))}
              <div className="pb-2">
                <h1 className="text-Pink text-2xl font-semibold">
                  My Requests
                </h1>
                {ongoingRequests.length == 0 && <p className="text-gray-500">No current ongoing requests</p>}
              </div>
              {ongoingRequests.map((job) => (
                <div
                  key={job.orderId}
                  className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="font-semibold text-xl text-Gray">
                        {job.serviceType}
                      </h2>
                      <span className="text-Pink font-medium">
                        {job.filename}
                      </span>
                    </div>

                    <p className="text-gray-500 text-sm mb-1">
                      Client: {job.firstName} {job.lastName}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Start Date:{" "}
                      {moment(job.receivedDate).format("MM/DD/YYYY")}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Material: {job.material}
                    </p>
                    <p className="text-gray-500 text-sm">Specs: {job.specs}</p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex border-t border-gray-100">
                    <button
                      className="flex-1 py-3 text-center border-r border-gray-100 text-gray-500"
                      onClick={() => router.push("/chatpage")}
                    >
                      Message
                    </button>

                    <button
                      className="flex-1 py-3 text-center text-Pink font-medium
                  hover:underline active:text-darkPink"
                      onClick={() => handleComplete(job.orderId)}
                    >
                      Complete
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === "completed" && (
            <>
              <div className="pb-2">
                <h1 className="text-Pink text-2xl font-semibold">
                  Completed Jobs
                </h1>
                {completedJobs.length == 0 && <p className="text-gray-500">No current completed jobs</p>}
              </div>

              {completedJobs.map((job) => (
                <div
                  key={job.historyId}
                  className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="font-semibold text-xl text-Gray">
                        {job.bannerName}
                      </h2>
                      <span className="text-Pink font-medium">{job.price}</span>
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
              <div className="pb-2">
                <h1 className="text-Pink text-2xl font-semibold">
                  Completed Jobs
                </h1>
                {completedRequests.length == 0 && <p className="text-gray-500">No current completed requests</p>}
              </div>
              {completedRequests.map((job) => (
                <div
                  key={job.orderId}
                  className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="font-semibold text-xl text-Gray">
                        {job.serviceType}
                      </h2>
                      <span className="text-Pink font-medium">
                        {job.filename}
                      </span>
                    </div>

                    <p className="text-gray-500 text-sm mb-1">
                      Client: {job.firstName} {job.lastName}
                    </p>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-gray-500 text-sm">
                        Start Date:{" "}
                        {moment(job.receivedDate).format("MM/DD/YYYY")}
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
                      className="inline-block text-xs py-1 px-2 rounded-full bg-green-100 text-green-600" // Completed
                    >
                      Completed
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
      )}
    </div>
  );
}
