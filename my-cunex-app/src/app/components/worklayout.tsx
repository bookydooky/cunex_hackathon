"use client";
import React, { ReactNode, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, Share2, MessageCircle } from "lucide-react";
import ImageCarousel from "./ImageCarousel";

interface WorkDetailLayoutProps {
  children: ReactNode;
  jobData: any;
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
      <div className="sticky top-0 left-0 right-0 px-4 py-2 flex items-center justify-between border-b">
        <div className="flex items-center">
          <ArrowLeft
            className="mr-4 text-Pink hover:text-darkPink transition-transform transform active:scale-90"
            onClick={() => handleNavigation("/")}
          />
          <div className="flex items-center">
            <img
              src="/assets/CUNEX-logo.png"
              alt="CUNEX Logo"
              className="h-12"
            />
            <div className="h-6 border-l border-gray-300 mx-5"></div>
            <div className="text-Pink text-xl font-medium">
              {jobData?.bannerName || "Loading..."}
            </div>
          </div>
        </div>
        <Share2 className="text-Gray" />
      </div>

      {/* Logo Image Carousel */}

      <ImageCarousel images={carouselImages} />

      {/* Tab Navigation */}
      <div className="flex border-b">
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
      <div className="flex-1 overflow-y-auto mx-2 pb-16">{children}</div>
      <div className="absolute bottom-0 left-0 right-0 p-4 h-20 bg-white flex items-center space-x-4">
        <button
          className="flex-grow bg-Pink hover:bg-darkPink text-white py-4 rounded-lg font-medium"
          onClick={() =>
            handleNavigation(`/work/checkout/${jobData.bannerId}/${userId}`)
          }
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
