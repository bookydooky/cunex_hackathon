'use client'
import React from 'react';
import { ArrowLeft, Share2, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const WorkFeedback = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col p-4">
      {/* Overall Rating */}
      <div className="flex items-center mb-6">
        <h2 className="text-xl text-Gray font-semibold mr-3">4.5</h2>
        <div className="flex items-center mr-3">
          <span className="text-yellow-400 text-xl">★</span>
          <span className="text-yellow-400 text-xl">★</span>
          <span className="text-yellow-400 text-xl">★</span>
          <span className="text-yellow-400 text-xl">★</span>
          <span className=" text-yellow-400 text-xl" style={{ clipPath: 'inset(0 50% 0 0)' }}>★</span>
        </div>
        <span className="text-gray-500">(4 reviews)</span>
      </div>

      {/* Review Cards */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Review Card 1 */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between mb-1">
            <div>
              <h3 className="font-bold text-lg text-Gray">John Doe</h3>
              <p className="text-gray-500">Fintech Solutions</p>
            </div>
            <div className="flex">
              <span className="text-yellow-400">★</span>
              <span className="text-yellow-400">★</span>
              <span className="text-yellow-400">★</span>
              <span className="text-yellow-400">★</span>
              <span className="text-yellow-400">★</span>
            </div>
          </div>
          <p className="italic text-Gray text-sm">
            Maria transformed our banking app with an incredible user-centered design. Her work significantly improved our user engagement.
          </p>
        </div>

        {/* Review Card 2 */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between mb-1">
            <div>
              <h3 className="font-bold text-lg text-Gray">Sarah Smith</h3>
              <p className="text-gray-500">Global Retail Inc.</p>
            </div>
            <div className="flex">
              <span className="text-yellow-400">★</span>
              <span className="text-yellow-400">★</span>
              <span className="text-yellow-400">★</span>
              <span className="text-yellow-400">★</span>
              <span className="text-yellow-400">★</span>
              <div className="relative -ml-4">
                <span className="absolute left-0 top-0 text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }}>★</span>
                <span className="text-gray-300">★</span>
              </div>
            </div>
          </div>
          <p className="italic text-Gray text-sm">
            Excellent attention to detail and a deep understanding of user experience. Highly recommended!
          </p>
        </div>

        {/* Review Card 3 */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between mb-1">
            <div>
              <h3 className="font-bold text-lg text-Gray">Pasut Chien</h3>
              <p className="text-gray-500">Chulalongkorn Univeristy</p>
            </div>
            <div className="flex">
              <span className="text-yellow-400">★</span>
              <span className="text-yellow-400">★</span>
              <span className="text-yellow-400">★</span>
              <span className="text-yellow-400">★</span>
              <span className="text-yellow-400">★</span>
              <div className="relative -ml-4">
                <span className="absolute left-0 top-0 text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }}>★</span>
                <span className="text-gray-300">★</span>
              </div>
            </div>
          </div>
          <p className="italic text-Gray text-sm">
            Excellent Work! We are so pleased with the result!
          </p>
        </div>

        {/* Review Card 4 */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between mb-1">
            <div>
              <h3 className="font-bold text-lg text-Gray">Book Pannawich</h3>
              <p className="text-gray-500">Chulalongkorn Univeristy</p>
            </div>
            <div className="flex">
              <span className="text-yellow-400">★</span>
              <span className="text-yellow-400">★</span>
              <span className="text-yellow-400">★</span>
              <span className="text-yellow-400">★</span>
            </div>
          </div>
          <p className="italic text-Gray text-sm">
            Maria handed in a very good work, but there is a room
            for little imrpovement.
          </p>
        </div>
      </div>

    </div>
  );
};


export default WorkFeedback;