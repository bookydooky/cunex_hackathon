"use client";

import React, { useEffect, useState } from "react";

import WorkLayout from "../../../components/worklayout"; // Import WorkLayout
import { useParams } from "next/navigation"; // Import useParams

const WorkDetailPreview = () => {
  const params = useParams();
  if (!params?.params) return <p>Loading...</p>;
  const [bannerId, userId] = params.params; // ✅ Get id dynamically  const router = useRouter();
  const [jobData, setJobData] = useState(null);

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

  if (!jobData) return <p>Loading job details...</p>;

  // const carouselImages = jobData.images
  //   ? jobData.images.map((img) => ({ src: img, alt: jobData.bannerName }))
  //   : [
  //       {
  //         // Fallback image if no images are available
  //         src: "/placeholder.jpg",
  //         alt: jobData.bannerName,
  //         caption: jobData.bannerName,
  //       },
  //     ];

  return (
    <WorkLayout jobData={jobData} userId={userId}>
      <div className="flex-1 overflow-auto p-4">
        <div className="mb-4">
          <h2 className="text-xl text-pink-500 font-medium mb-1">
            {jobData.bannerName}
          </h2>
          <p className="text-gray-600">
            Price: {jobData.price} THB | Duration: {jobData.duration} | Type:{" "}
            {jobData.typeOfWork}
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg text-black font-bold mb-2">
            Project Description
          </h3>
          <p className="text-gray-700">{jobData.bannerdesc}</p>
          <p className="text-gray-700 mt-2">
            You will receive three high-quality final drafts in PNG/JPEG format,
            ready for immediate use on your products, website, and marketing
            materials.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg text-black font-bold mb-2">Tools</h3>
          <div className="flex flex-wrap gap-2">
            <div className="bg-pink-100 text-pink-500 px-6 py-3 rounded-lg">
              Figma
            </div>
            <div className="bg-pink-100 text-pink-500 px-6 py-3 rounded-lg">
              Adobe XD
            </div>
            <div className="bg-pink-100 text-pink-500 px-6 py-3 rounded-lg">
              InVision
            </div>
          </div>
        </div>
      </div>
    </WorkLayout>
  );
};

export default WorkDetailPreview;
