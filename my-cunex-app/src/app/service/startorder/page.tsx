"use client";
import { useContext, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { GlobalStateContext } from "@/app/context/GlobalState";

export default function ServiceSelectionPage() {
  const { service } = useContext(GlobalStateContext);
  const router = useRouter();
  useEffect(() => {
    console.log(service);
  })

  return (
    <div>
      <div className="container mx-auto px-4 py-8 max-w-4xl flex-grow flex flex-col">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-Pink mb-2">
            Fabrication Services
          </h1>
          <p className="text-xl text-Pink">
            3D Printing, Laser Cutting, and more to come!
          </p>
        </header>

        <div className="flex justify-between mb-8">
          <div className="flex-1 text-center px-4">
            <div className="w-10 h-10 rounded-full bg-Pink text-white flex items-center justify-center mx-auto mb-2 font-bold">
              1
            </div>

            <div className="text-Pink font-semibold">Start Order</div>
          </div>
          <div className="flex-1 text-center px-4">
            <div className="w-10 h-10 rounded-full bg-pink-200 text-Pink flex items-center justify-center mx-auto mb-2 font-bold">
              2
            </div>
            <div className="text-gray-500 font-semibold">Enter Details</div>
          </div>
          <div className="flex-1 text-center px-4">
            <div className="w-10 h-10 rounded-full bg-pink-200 text-Pink flex items-center justify-center mx-auto mb-2 font-bold">
              3
            </div>
            <div className="text-gray-500 font-semibold">Review & Pay</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 flex flex-col">
          <h2 className="text-2xl font-semibold mb-6 text-center text-Gray">
            {service == '3d' ? '3D Printing' : 'Laser Cutting'}
          </h2>

            {/* 3D Printing Option */}
            {service === '3d' && (
                <div
                className='border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${
                    border-pink-500
                '
                >
                <div className="bg-pink-100 p-6 flex justify-center items-center">
                    <div className="text-6xl">
                      <img src='https://cdn-icons-png.flaticon.com/512/2844/2844942.png' alt='3D printing vector'
                      className="h-20"/>
                    </div>
                </div>
                <div className="p-6">
                    <h3 className="text-xl text-Pink font-bold mb-2">
                    3D Printing
                    </h3>
                    <p className="text-gray-500 mb-4">
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
                )
            }
            {/* Laser Cutting Option */}
            {service === 'lasercut' && (
                <div
                className='border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${
                  border-pink-500
                '
              >
                <div className="bg-pink-100 p-6 flex justify-center items-center">
                  <div className="text-6xl">
                    <img src='https://cdn-icons-png.flaticon.com/512/2162/2162509.png'
                    alt='Laser cutting vector' className="h-20"/>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl text-Pink font-bold mb-2">
                    Laser Cutting
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Precise cutting or engraving of flat materials with clean
                    edges and intricate details.
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Fast production time</li>
                    <li>• Works with various sheet materials</li>
                    <li>• Ideal for 2D designs & engravings</li>
                  </ul>
                </div>
              </div>
                )
            }

          <div className="mt-10 text-center">
            <button
              className='bg-Pink text-white py-3 px-8 w-full rounded-full text-lg font-medium transition-all ${
                 hover:bg-darkPink transition-transform transform active:scale-90
              '
              onClick={() => { router.push('/service/detail') }}
            >
              Continue to Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}