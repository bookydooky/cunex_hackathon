"use client";
import { use, useState } from "react";
import { useRouter } from 'next/navigation'

export default function ServiceSelectionPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-4xl flex-grow flex flex-col">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-pink-500 mb-2">
            Fabrication Services
          </h1>
          <p className="text-xl text-pink-400">
            3D Printing, Laser Cutting, and more to come!
          </p>
        </header>

        <div className="flex justify-between mb-8">
          <div className="flex-1 text-center px-4">
            <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center mx-auto mb-2 font-bold">
              1
            </div>
            <div className="text-gray-800 font-semibold">Start Order</div>
          </div>
          <div className="flex-1 text-center px-4">
            <div className="w-10 h-10 rounded-full bg-pink-200 text-pink-500 flex items-center justify-center mx-auto mb-2 font-bold">
              2
            </div>
            <div className="text-gray-800 font-semibold">Enter Details</div>
          </div>
          <div className="flex-1 text-center px-4">
            <div className="w-10 h-10 rounded-full bg-pink-200 text-pink-500 flex items-center justify-center mx-auto mb-2 font-bold">
              3
            </div>
            <div className="text-gray-800 font-semibold">Review & Pay</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 flex-grow">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            3D Printing
          </h2>

            {/* 3D Printing Option */}
            <div
              className='border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${
                border-pink-500
              '
            >
              <div className="bg-pink-100 p-6 flex justify-center items-center">
                <div className="text-6xl">🧩</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-pink-500 mb-2">
                  3D Printing
                </h3>
                <p className="text-gray-800 mb-4">
                  Create complex three-dimensional objects from digital models
                  with precision and customization.
                </p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Perfect for prototypes & custom parts</li>
                  <li>• Various materials available</li>
                  <li>• Detailed & complex geometries</li>
                </ul>
              </div>
            </div>

          <div className="mt-10 text-center">
            <button
              className='bg-pink-500 text-white py-3 px-8 rounded-full text-lg font-semibold transition-all ${
                 hover:bg-pink-600 transition-transform transform active:scale-90
              '
              onClick={() => { router.push('/service/fabrication/3d/detail') }}
            >
              Continue to Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}