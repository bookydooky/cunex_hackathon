import React from 'react';
import { ArrowLeft, Share2, Users, Clock } from 'lucide-react';

const CreateJobCollab = () => {
  return (
    <div className="relative flex flex-col h-full bg-gray-900 bg-opacity-50 mx-auto shadow-lg"> {/* Translucent background */}

      {/* Create Job Page Content */}
      <div className="absolute inset-0 z-0">
        <div className="flex flex-col h-full bg-gray-100 mx-auto shadow-lg"> {/* Changed background to gray */}

          {/* App Header */}
          <div className="px-4 py-3 flex items-center justify-between border-b bg-white">
            <div className="flex items-center">
              <ArrowLeft className="mr-4 text-pink-500" />
              <div className="flex items-center">
                <div className="font-bold text-lg">
                  <span className="text-pink-500">CU</span>
                  <span className="text-black">NEX</span>
                </div>
                <div className="h-6 border-l border-gray-300 mx-3"></div>
                <div className="text-pink-500 text-xl font-medium">Create Job</div>
              </div>
            </div>
            <Share2 className="text-black" />
          </div>

          {/* Progress Bar */}
          <div className="flex w-full h-1 space-x-1">
            <div className="bg-pink-500 w-1/2 rounded-l-full"></div>
            <div className="bg-gray-300 w-1/2 rounded-r-full"></div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {/* User Profile Section - Added white background and shadow */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex items-start">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                  <Users size={28} className="text-pink-300" />
                </div>
                <div className="ml-4">
                  <div className="font-bold text-xl text-black">Maria Schmidt</div>
                  <div className="flex items-center">
                    <div className="text-yellow-400">★</div>
                    <div className="ml-1 font-medium text-black">4.9</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid - Added white background and shadow */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-pink-50 p-4 rounded-lg">
                  <div className="flex items-center text-pink-500 mb-1">
                    <div className="w-4 h-4 mr-2">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-sm text-black">Success Rate</span>
                  </div>
                  <div className="font-bold text-lg text-black">98%</div>
                </div>
                
                <div className="bg-pink-50 p-4 rounded-lg">
                  <div className="flex items-center text-pink-500 mb-1">
                    <Users size={16} className="mr-2" />
                    <span className="text-sm text-black">Jobs Sold</span>
                  </div>
                  <div className="font-bold text-lg text-black">156</div>
                </div>
                
                <div className="bg-pink-50 p-4 rounded-lg">
                  <div className="flex items-center text-pink-500 mb-1">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2 text-pink-500">
                      <path d="M16 5v2a10 10 0 0 1-10 10h0c0-5.5 4.5-10 10-10h2m-2-2h7v7" />
                    </svg>
                    <span className="text-sm text-black">Rehired</span>
                  </div>
                  <div className="font-bold text-lg text-black">42 times</div>
                </div>
                
                <div className="bg-pink-50 p-4 rounded-lg">
                  <div className="flex items-center text-pink-500 mb-1">
                    <Clock size={16} className="mr-2" />
                    <span className="text-sm text-black">Avg. Response</span>
                  </div>
                  <div className="font-bold text-lg text-black">2 hours</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
          <h2 className="text-xl font-bold mb-4">Collaborate with Others</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Add Team Members</label>
            <input
              type="email"
              placeholder="Example@gmail.com"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <button className="mt-2 w-full bg-pink-500 text-white py-2 px-4 rounded-lg">Add</button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Find Team Members</label>
            <div className="flex items-center space-x-2">
              <select className="w-full p-3 border border-gray-300 rounded-lg">
                <option value="UX/UI">UX/UI</option>
                <option value="development">Development</option>
                <option value="writing">Writing</option>
              </select>
              <input
                type="number"
                placeholder="3"
                className="w-16 p-3 border border-gray-300 rounded-lg"
              />
              <span>People</span>
            </div>
            <button className="mt-2 w-full bg-pink-500 text-white py-2 px-4 rounded-lg">Add</button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Included Members</label>
            <div className="flex flex-wrap space-x-2">
              <span className="bg-pink-100 text-pink-500 py-1 px-3 rounded-full">UX/UI 3</span>
              <span className="bg-pink-100 text-pink-500 py-1 px-3 rounded-full">Example@gmail.com</span>
            </div>
          </div>
          <button className="w-full bg-pink-500 text-white py-2 px-4 rounded-lg">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default CreateJobCollab;