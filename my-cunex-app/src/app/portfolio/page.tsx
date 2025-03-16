'use client'
import React, { useState } from 'react';
import { IoCloudUpload } from "react-icons/io5";
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Portfolio() {
  const [portfolioItems, setPortfolioItems] = useState<File[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPortfolioItems([...portfolioItems, ...files]);
  };

  const handlePreviousPage = () => {
    router.push('/create-job');
  };

  const handleAddPortfolio = async () => {
    // Simulate backend response
    try {
      const formData = new FormData();
      portfolioItems.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });

      // Simulate a delay to mimic backend response
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Show success popup
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 3000); // Hide the pop-up after 3 seconds
    } catch (error) {
      console.error('Error uploading portfolio:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation bar */}
      <div className="px-4 py-5 flex justify-between items-center bg-white">
        <div className="flex items-center">
          <button onClick={handlePreviousPage}
          className="transition-transform transform active:scale-90">
                <ArrowLeft className="mr-4 text-pink-500 hover:text-pink-800" />
          </button>
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
            <label htmlFor="file-upload" className="bg-pink-500 text-white px-6 py-2 rounded-md cursor-pointer
            transition-transform transition-colors transform hover:scale-105 active:scale-95 duration-200 ease-in-out hover:bg-pink-600 active:bg-pink-700">
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
        {portfolioItems.length === 0 ? (
          <p className="text-gray-500 text-center mb-4">No portfolio items added yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {portfolioItems.map((item, index) => (
              <div key={index} className="border-2 rounded-lg p-2 flex flex-col items-center">
                <div className="w-full h-24 bg-gray-200 rounded-md mb-2 flex items-center justify-center">
                  <p className="text-sm text-gray-600">{item.name}</p>
                </div>
                <p className="text-sm text-gray-600">Portfolio Item {index + 1}</p>
              </div>
            ))}
          </div>
        )}
        
        {/* Add portfolio button */}
        <button onClick={handleAddPortfolio}
        className="w-full bg-pink-500 text-white py-4 rounded-lg text-lg font-semibold
        transition-colors duration-200 ease-in-out hover:bg-pink-600 active:bg-pink-700">
          Submit Portfolio
        </button>
      </div>
      {showPopup && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
          Portfolio item successfully added!
        </div>
      )}
    </div>
  );
}