'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const router = useRouter();
  return (
    <div className="h-screen bg-gray-100">
      {/* Navigation bar */}
      <div className="px-4 py-5 flex justify-between items-center bg-white">
        <div className="flex items-center">
          <button onClick={() => router.push('/')}
          className="transition-transform transform active:scale-90">
                <ArrowLeft className="mr-4 text-pink-500 hover:text-pink-800" />
          </button>
          <div className="flex items-center">
            <span className="text-pink-500 font-semibold text-xl">CU</span>
            <span className="text-gray-800 font-bold text-xl">NEX</span>
          </div>
          <div className="h-6 border-l border-gray-300 mx-5"></div>
          <div className="text-pink-500 font-medium text-xl">Profile</div>
        </div>
        <Share2 className="text-black" />
      </div>

        {/* Profile summary */}
      <div className="bg-white mx-4 mt-4 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 flex w-full items-center justify-center gap-x-5">
          {/* Profile image */}
          <div className="w-30 h-30 bg-gray-100 rounded-full flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          
          {/* Profile info */}
          <div className='flex flex-col items-start'>
            <h2 className="font-bold text-black text-xl">Pasut Chien</h2>
            <p className="text-gray-500 text-sm">3<sup>rd</sup> Year Student</p>
            <p className="text-gray-500 text-sm">Faculty: Engineering</p>
            <p className="text-gray-500 text-sm">ID: 6534056824</p>
            <div className="mt-2 flex justify-center">
                <button className="border border-pink-500 text-pink-500 rounded-full px-6 py-1 w-50 text-sm">
                    Edit Profile
                </button>
            </div>
          </div>
        </div>
            
        {/* Stats */}
        <div className="flex border-t border-gray-100">
          <div className="flex-1 py-3 text-center border-r border-gray-100">
            <p className="font-bold text-xl text-black">8</p>
            <p className="text-gray-500 text-xs">Completed</p>
          </div>
          <div className="flex-1 py-3 text-center border-r border-gray-100">
            <p className="font-bold text-xl text-black">2</p>
            <p className="text-gray-500 text-xs">Active</p>
          </div>
          <div className="flex-1 py-3 text-center">
            <p className="font-bold text-xl text-black">4.7</p>
            <p className="text-gray-500 text-xs">Rating</p>
          </div>
        </div>
      </div>
      
      {/* Menu items */}
      <div className="mx-4 mt-4">
        {/* My Jobs */}
        <div className="bg-white rounded-lg mb-3 shadow-sm">
          <Link href="/jobs">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                  <span className="text-pink-500 text-sm">+</span>
                </div>
                <span className='text-gray-800'>My Jobs</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
        </div>
        
        {/* Payment Methods */}
        <div className="bg-white rounded-lg mb-3 shadow-sm">
          <Link href="/payment-methods">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                  <span className="text-pink-500 text-sm">−</span>
                </div>
                <span className='text-gray-800'>Payment Methods</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
        </div>
        
        {/* Order History */}
        <div className="bg-white rounded-lg mb-3 shadow-sm">
          <Link href="/order-history">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                  <span className="text-pink-500 text-sm">×</span>
                </div>
                <span className='text-gray-800'>Order History</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
        </div>
        
        {/* Settings */}
        <div className="bg-white rounded-lg mb-3 shadow-sm">
          <Link href="/settings">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                  <span className="text-pink-500 text-sm">◯</span>
                </div>
                <span className='text-gray-800'>Settings</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}