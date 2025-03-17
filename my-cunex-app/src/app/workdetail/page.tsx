import React from 'react';
import { ArrowLeft, Share2, MessageCircle } from 'lucide-react';

const WorkDetailPreview = () => {
  return (
    <div className="flex flex-col h-full bg-white mx-auto shadow-lg">
      {/* App Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b">
        <div className="flex items-center">
          <ArrowLeft className="mr-4 text-pink-500" />
          <div className="flex items-center">
            <div className="font-bold text-lg">
              <span className="text-pink-500">CU</span>
              <span className="text-gray-700">NEX</span>
            </div>
            <div className="h-6 border-l border-gray-300 mx-3"></div>
            <div className="text-pink-500 text-xl font-medium">Logo Design</div>
          </div>
        </div>
        <Share2 className="text-gray-700" />
      </div>

      {/* Logo Image Carousel */}
      <div className="relative py-6">
        <div className="flex justify-center items-center">
          <button className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          
          <div className="w-64 h-64 relative mx-auto">
            <div className="absolute inset-0 flex justify-center items-center bg-white shadow-sm rounded-lg">
              <div className="text-center p-4">
                <div className="flex justify-center mb-3">
                  <svg viewBox="0 0 200 200" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="featherGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7928CA" />
                        <stop offset="50%" stopColor="#FF0080" />
                        <stop offset="100%" stopColor="#FF8C00" />
                      </linearGradient>
                    </defs>
                    <path d="M130,30 C150,40 160,60 160,80 C160,100 140,120 120,130 C100,140 80,130 60,110 C40,90 20,70 30,50 C40,30 60,20 80,30 C100,40 110,20 130,30 Z" fill="url(#featherGradient)" />
                    <path d="M80,100 C90,90 100,80 110,90 C120,100 130,110 120,120 C110,130 100,120 90,110 C80,100 70,110 80,100 Z" fill="#3B82F6" />
                  </svg>
                </div>
                <div className="font-bold uppercase text-xl">LOREM <span className="font-normal">IPSUM</span></div>
              </div>
            </div>
          </div>
          
          <button className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b">
        <button className="flex-1 text-center py-3 text-pink-500 border-b-2 border-pink-500 font-medium">
          Detail
        </button>
        <button className="flex-1 text-center py-3 text-gray-500">
          About
        </button>
        <button className="flex-1 text-center py-3 text-gray-500">
          Feedback
        </button>
      </div>

      {/* Work Detail Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="mb-4">
          <h2 className="text-xl text-pink-500 font-medium mb-1">Logo Design</h2>
          <p className="text-gray-600">
            Price: 300THB | Duration: 4 weeks | Type: Graphic Design
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Project Description</h3>
          <p className="text-gray-700">
            Looking for a unique and professional logo to represent your brand? I offer custom logo design tailored to your business needs, ensuring a visually appealing and memorable identity.
          </p>
          <p className="text-gray-700 mt-2">
            You will receive three high-quality final drafts in PNG/JPEG format, ready for immediate use on your products, website, and marketing materials.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Tools</h3>
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

        <button className="w-full bg-pink-500 text-white py-4 rounded-lg font-medium mb-4">
          Request Design
        </button>

        {/* Chat Button */}
        <div className="fixed bottom-6 right-6 bg-white rounded-full p-3 shadow-lg border border-gray-200">
          <MessageCircle size={24} className="text-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default WorkDetailPreview;