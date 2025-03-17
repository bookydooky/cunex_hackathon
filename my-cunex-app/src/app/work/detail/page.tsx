'use client'
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const WorkDetail = () => {
  const router = useRouter();

  return (

      <div className="flex-1 overflow-auto p-4">
        <div className="mt-2 mb-4">
          <h2 className="text-xl text-pink-500 font-bold mb-1">Logo Design</h2>
          <p className="text-gray-600">
            Price: 300THB | Duration: 4 weeks | Type: Graphic Design
          </p>
        </div>

        <div className="mt-6 mb-6">
          <h3 className="text-black text-lg font-bold mb-2">Project Description</h3>
          <p className="text-gray-700">
            Looking for a unique and professional logo to represent your brand? I offer custom logo design tailored to your business needs, ensuring a visually appealing and memorable identity.
          </p>
          <p className="text-gray-700 mt-2">
            You will receive three high-quality final drafts in PNG/JPEG format, ready for immediate use on your products, website, and marketing materials.
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

        <button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-lg font-medium mb-4">
          Request Design
        </button>

        {/* Chat Button */}
        <div className="fixed bottom-6 right-6 bg-white rounded-full p-3 shadow-lg border border-gray-200">
          <MessageCircle size={24} className="text-gray-600" />
        </div>
      </div>

  );
};

export default WorkDetail;