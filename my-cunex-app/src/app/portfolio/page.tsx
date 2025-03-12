'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoCloudUpload } from "react-icons/io5";
import { ArrowLeft } from 'lucide-react';

export default function Portfolio() {
  const [portfolioItems, setPortfolioItems] = useState(Array(6).fill(null));
  
  const handleFileUpload = (e) => {
    // Handle file upload logic here
    console.log("Files uploaded:", e.target.files);
    // In a real app, you would process these files and update portfolioItems
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation bar */}
      <div className="px-4 py-5 flex justify-between items-center bg-white">
        <div className="flex items-center">
          <ArrowLeft className="mr-4 text-pink-500" />
          <div className="flex items-center">
            <span className="text-pink-500 font-semibold text-xl">CU</span>
            <span className="text-gray-800 font-bold text-xl">NEX</span>
          </div>
          <div className="h-6 border-l border-gray-300 mx-5"></div>
          <div className="text-pink-500 font-medium text-xl">Portfolio</div>
        </div>
        <button className="text-black">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </button>
      </div>
      
      {/* Divider lines */}
      <div className="flex px-4 mt-4">
        <div className="h-1 bg-pink-500 flex-1 rounded-full mr-2"></div>
        <div className="h-1 bg-pink-500 flex-1 rounded-full ml-2"></div>
      </div>
      
      {/* Main content */}
      <div className="px-4 py-6">
        {/* Info box */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8">
          <h2 className="text-xl text-black font-bold mb-2">Portfolio and Examples</h2>
          <p className="text-gray-600">
            These pictures will provide the customers a brief view of what kind of 
            product/service they will receive. You can also attach your portfolio for 
            your own creditibility.
          </p>
          
          {/* Upload area */}
          <div className="border-2 border-dashed border-pink-300 rounded-lg p-6 mt-4 flex flex-col items-center justify-center">
            <div className="text-pink-500 mb-2">
              <IoCloudUpload className="text-4xl" />    
            </div>
            <p className="text-gray-500 text-center mb-4">
              Click to upload documents, images, or files
            </p>
            <label htmlFor="file-upload" className="bg-pink-500 text-white px-6 py-2 rounded-md cursor-pointer">
              Upload Files
            </label>
            <input 
              id="file-upload" 
              type="file" 
              multiple 
              className="hidden"
              onChange={handleFileUpload} 
            />
          </div>
        </div>
        
        {/* Portfolio grid */}
        <h2 className="text-xl text-black font-bold mb-4">Your Portfolio Previews</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {portfolioItems.map((item, index) => (
            <div key={index} className="border-2 rounded-lg p-2 flex flex-col items-center">
              <div className="w-full h-24 bg-gray-200 rounded-md mb-2"></div>
              <p className="text-sm text-gray-600">Portfolio Item {index + 1}</p>
            </div>
          ))}
        </div>
        
        {/* Add portfolio button */}
        <button className="w-full bg-pink-500 text-white py-4 rounded-lg text-lg font-semibold">
          Add Portfolio
        </button>
      </div>
    </div>
  );
}