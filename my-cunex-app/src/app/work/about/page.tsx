'use client'
import React from 'react';
import { Users, Clock, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const WorkAbout = () => {
  const router = useRouter();
  return (

  <div className="p-4">
    
    {/* View Full Profile Link */}
    <div className="text-right">
      <a href="#" className="text-pink-500 text-sm hover:underline hover:underline-offset-1">View Full Profile</a>
    </div>
    
    {/* Profile Header */}
    <div className="flex items-center mt-2 mb-4">
      <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden border-4 border-pink-400">
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
          120 x 120
        </div>
      </div>
      <div className="ml-6">
        <h2 className="text-2xl text-black font-bold">Maria Schmidt</h2>
        <p className="text-gray-500">3rd Year, Design & Technology</p>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className="text-yellow-400 text-sm">★</span>
          ))}
          <span className="text-gray-500 text-sm ml-2">(4.9)</span>
        </div>
      </div>
    </div>
    
    {/* Stats Grid */}
    <div className="grid grid-cols-2 gap-4 mb-4">
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
    
    {/* Bio Section */}
    <div className='mb-6'>
      <h3 className="text-xl text-black font-bold mb-2">Bio</h3>
      <p className="text-gray-700">
        Passionate interaction designer with a focus on creating user-centric digital experiences. 
        I believe in design that not only looks great but also solves real-world problems.
      </p>
    </div>
  </div>
  );
};

export default WorkAbout;