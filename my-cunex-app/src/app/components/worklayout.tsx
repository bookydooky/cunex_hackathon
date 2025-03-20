"use client";
import React, { ReactNode, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, Share2, MessageCircle } from "lucide-react";
import ImageCarousel from "./ImageCarousel";

interface WorkDetailLayoutProps {
  children: ReactNode;
  jobData: any;
}

const WorkLayout: React.FC<WorkDetailLayoutProps> = ({ children, jobData }) => {
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
      <div className="px-4 py-2 flex items-center justify-between border-b">
        <div className="flex items-center">
          <ArrowLeft
            className="mr-4 text-pink-500 hover:text-pink-800 transition-transform transform active:scale-90"
            onClick={() => handleNavigation("/")}
          />
          <div className="flex items-center">
            <img src="/assets/CUNEX-logo.png" alt="CUNEX Logo" className="h-12" />
            <div className="h-6 border-l border-gray-300 mx-5"></div>
            <div className="text-pink-500 text-xl font-medium">
              {jobData?.bannerName || "Loading..."}
            </div>
          </div>
        </div>
        <Share2 className="text-gray-700" />
      </div>

      {/* Logo Image Carousel */}
      <div className="py-6">
        <ImageCarousel images={carouselImages} />
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b">
        <button
          onClick={() =>
            handleNavigation(`/work/workdetail/${jobData.bannerId}`)
          }
          className={`flex-1 text-center py-3 ${
            selectedTab === `/work/workdetail/${jobData.bannerId}`
              ? "text-pink-500 border-b-2 border-pink-500 font-medium"
              : "text-gray-500 hover:text-pink-500"
          }`}
        >
          Detail
        </button>
        <button
          onClick={() => handleNavigation(`/work/about/${jobData.bannerId}`)}
          className={`flex-1 text-center py-3 ${
            selectedTab === `/work/about/${jobData.bannerId}`
              ? "text-pink-500 border-b-2 border-pink-500  font-medium"
              : "text-gray-500 hover:text-pink-500"
          }`}
        >
          About
        </button>
        <button
          onClick={() => handleNavigation(`/work/feedback/${jobData.bannerId}`)}
          className={`flex-1 text-center py-3 ${
            selectedTab === `/work/feedback/${jobData.bannerId}`
              ? "text-pink-500 border-b-2 border-pink-500  font-medium"
              : "text-gray-500 hover:text-pink-500"
          }`}
        >
          Feedback
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto mx-2 pb-16">{children}</div>
      <div className="absolute bottom-0 left-0 right-0 p-4 h-20 bg-white flex items-center space-x-4">
        <button
          className="flex-grow bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-lg font-medium"
          onClick={() => handleNavigation(`/work/checkout/${jobData.bannerId}`)}
        >
          Request Design
        </button>

        {/* Chat Button */}
        <div className="flex-shrink-0 bg-white rounded-full p-3 shadow-lg border border-gray-200">
          <MessageCircle size={24} className="text-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default WorkLayout;
