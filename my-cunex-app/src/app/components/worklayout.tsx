"use client";
import React, { ReactNode, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";
import Image from "next/image";
import ImageCarousel from "./ImageCarousel";

interface JobDetailResponse {
  bannerId: string;
  userId: string;
  bannerName: string;
  price: number;
  duration: string; // Duration in days, or another appropriate unit
  typeOfWork: string;
  bannerdesc: string;
  images: string[]; // Array of image URLs
}

interface WorkDetailLayoutProps {
  jobData: JobDetailResponse;
  userId: string;
  children: ReactNode; // To accept child elements (the content inside WorkLayout)
}

const WorkLayout: React.FC<WorkDetailLayoutProps> = ({
  children,
  jobData,
  userId,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedTab, setSelectedTab] = useState(pathname);

  useEffect(() => {
    setSelectedTab(pathname);
  }, [pathname]);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const carouselImages = jobData?.images
    ? jobData.images.map((img) => ({
        src: img,
        alt: jobData?.bannerName || "Job Image",
      }))
    : [
        {
          src: "/placeholder.jpg",
          alt: "Placeholder Image",
          caption: "No Images Available",
        },
      ];

  return (
    <div className="flex flex-col h-screen bg-white mx-auto shadow-lg relative">
      {/* App Header */}
      <div className="sticky top-0 left-0 right-0 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <ArrowLeft
            className="mr-4 text-Pink hover:text-darkPink active:text-darkPink
            transition-transform transform active:scale-90"
            onClick={() => handleNavigation("/")}
          />
          <div className="flex items-center">
            <Image
              src="/assets/CUNEX-logo.png"
              alt="CUNEX Logo"
              width={48}
              height={48}
              className="h-12"
            />
            <div className="h-6 border-l border-gray-300 mx-5"></div>
            <div className="text-Pink text-xl font-medium">
              {jobData?.bannerName || "Loading..."}
            </div>
          </div>
        </div>
      </div>

      {/* Logo Image Carousel */}
      <ImageCarousel images={carouselImages} />

      {/* Tab Navigation */}
      <div className="flex">
        <button
          onClick={() =>
            handleNavigation(`/work/workdetail/${jobData.bannerId}/${userId}`)
          }
          className={`flex-1 text-center py-3 ${
            selectedTab === `/work/workdetail/${jobData.bannerId}/${userId}`
              ? "text-Pink border-b-2 border-Pink font-medium"
              : "text-gray-500 hover:text-Pink"
          }`}
        >
          Detail
        </button>
        <button
          onClick={() =>
            handleNavigation(`/work/about/${jobData.bannerId}/${userId}`)
          }
          className={`flex-1 text-center py-3 ${
            selectedTab === `/work/about/${jobData.bannerId}/${userId}`
              ? "text-Pink border-b-2 border-Pink  font-medium"
              : "text-gray-500 hover:text-Pink"
          }`}
        >
          About
        </button>
        <button
          onClick={() =>
            handleNavigation(`/work/feedback/${jobData.bannerId}/${userId}`)
          }
          className={`flex-1 text-center py-3 ${
            selectedTab === `/work/feedback/${jobData.bannerId}/${userId}`
              ? "text-Pink border-b-2 border-Pink  font-medium"
              : "text-gray-500 hover:text-Pink"
          }`}
        >
          Feedback
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto mx-2">{children}</div>
      <div className="sticky bottom-0 left-0 right-0 p-4 h-20 bg-white flex items-center space-x-4">
        <button
          className="flex-grow bg-Pink hover:bg-darkPink active:bg-darkPink
           text-white py-3 rounded-lg font-medium"
          onClick={() =>
            handleNavigation(`/work/checkout/${jobData.bannerId}/${userId}`)
          }
        >
          Request Design
        </button>

        {/* Chat Button */}
        <div className="flex-shrink-0 bg-white rounded-full p-3 shadow-lg border border-gray-200
        cursor-pointer hover:bg-gray-100 active:bg-gray-100">
          <MessageCircle size={24} onClick={() => router.push("/chatpage")}
          className="text-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default WorkLayout;
