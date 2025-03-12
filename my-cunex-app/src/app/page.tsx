import React from 'react';
import Head from 'next/head';
import { 
  FiBox, FiUsers, FiPlus, FiHome, FiCalendar, FiGrid, FiEdit
} from 'react-icons/fi';
import { BiCube } from 'react-icons/bi';
import { GiCutDiamond } from 'react-icons/gi';
import { MdFoodBank, MdLocationOn } from 'react-icons/md';
import { RiVideoAiFill } from 'react-icons/ri';
import { FaCode, FaBell, FaPaintBrush, FaBook, FaLanguage, FaEllipsisH } from 'react-icons/fa';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoPersonSharp } from "react-icons/io5";
import { TiWeatherPartlySunny } from "react-icons/ti";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Head>
        <title>CU FASTWORK</title>
        <meta name="description" content="CU FASTWORK App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <div className="bg-white p-4 shadow-md">
        <div className="flex justify-between items-center">
          <div className="text-lg font-bold text-pink-500">CU<span className="text-gray-800">NEX</span></div>
          <div className="flex-1 mx-2">
            <div className="bg-gray-100 rounded-full px-3 py-2 flex items-center w-full">
              <input type='search' placeholder='What are you looking for?' className="text-gray-400 text-sm flex-1 bg-transparent outline-none"/>
              <FaMagnifyingGlass className="text-gray-400"/>
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="bg-gray-100 rounded-full p-2 flex items-center justify-center">
              <FaBell className='text-gray-400 text-lg'/>
            </div>
            <div className="bg-gray-100 rounded-full p-2 flex items-center justify-center">
              <IoPersonSharp className='text-gray-400 text-lg'/>
            </div>
          </div>
        </div>
        {/* Location and Weather */}
        <div className="mt-2 text-sm text-gray-600 flex items-center">
          <MdLocationOn className="text-pink-500" /><span className="ml-1">Chulalongkorn University</span>
          <TiWeatherPartlySunny className="ml-4 text-pink-500"/>
          <span className="ml-1">27°C</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* Service Categories */}
        <div className="grid grid-cols-4 gap-3 md:grid-cols-4 sm:grid-cols-3">
          {[{icon: FiEdit, label: "UX/UI"}, {icon: FaCode, label: "Coding"}, {icon: FaPaintBrush, label: "Graphic"}, {icon: RiVideoAiFill, label: "Video"}, {icon: FaBook, label: "Tutoring"}, {icon: FaLanguage, label: "Language"}, {icon: BiCube, label: "Modeling"}, {icon: FaEllipsisH, label: "Others"}].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="bg-pink-100 rounded-full p-4 w-16 h-16 flex items-center justify-center">
                <item.icon className="text-pink-500 text-2xl" />
              </div>
              <span className="text-xs text-gray-600 mt-1 text-center">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Request Services */}
        <div className="mt-6 bg-white px-4 py-3 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-lg text-gray-600 font-bold mb-2">Request Services</h2>
            <h2 className="text-sm text-pink-500 font-bold mb-2">More</h2>
          </div>
          <div className="flex overflow-x-auto space-x-10 pb-2 justify-center">
            {[{icon: FiBox, label: "Item Delivery"}, {icon: MdFoodBank, label: "Food Delivery"}, {icon: BiCube, label: "3D Printing"}, {icon: GiCutDiamond, label: "Laser Cutting"}].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="bg-gray-200 rounded-full p-4 w-14 h-14 flex items-center justify-center">
                  <item.icon className="text-black text-2xl" />
                </div>
                <span className="text-xs text-gray-600 mt-1 text-center">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Jobs */}
        <div className="mt-6 mx-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg text-gray-600 font-bold mb-2">Latest Jobs</h2>
            <h2 className="text-sm text-pink-500 font-bold mb-2">See All</h2>
          </div>
          <div className="flex overflow-x-auto space-x-3 pb-2">
            <div className="w-24 h-24 bg-pink-100 rounded-lg flex items-center justify-center">
              <FiPlus className="text-pink-400 text-3xl" />
            </div>
            {["Logo Design", "Video Editing", "Math Tutoring"].map((job, idx) => (
              <div key={idx} className="w-24 h-24 bg-white rounded-lg overflow-hidden">
                <img src={`https://via.placeholder.com/100x100?text=${job}`} alt={job} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
