// components/BottomNavigation.tsx
import React from 'react';
import { FiHome, FiCalendar, FiGrid, FiEdit } from 'react-icons/fi';

export default function BottomNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg z-10">
      <div className="bg-pink-500 rounded-full py-2 px-4 flex justify-between items-center mx-4 my-2">
        <div className="flex items-center text-white">
          <FiHome className="text-xl" />
          <span className="ml-2">Home</span>
        </div>
        <div className="flex items-center text-white">
          <FiCalendar className="text-xl" />
          <span className="ml-2">Calendar</span>
        </div>
        <div className="flex items-center text-white">
          <FiGrid className="text-xl" />
          <span className="ml-2">Digital ID</span>
        </div>
        <div className="flex items-center text-white">
          <span className="text-xl">K+</span>
          <span className="ml-2">K PLUS</span>
        </div>
        <div className="flex items-center text-white">
          <FiEdit className="text-xl" />
          <span className="ml-2">CU FASTWORK</span>
        </div>
      </div>
    </div>
  );
}