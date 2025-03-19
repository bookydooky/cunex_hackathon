"use client";
import { useState } from "react";

export default function ServiceSelectionPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
  };

  const handleContinue = () => {
    // In a real app, this would navigate to the next page
    alert(`You selected ${selectedService}. Moving to details page.`);
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-4xl flex-grow flex flex-col">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-pink-500 mb-2">
            Fabrication Services
          </h1>
          <p className="text-xl text-pink-400">
            Choose your manufacturing method
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
            Select Service Type
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* 3D Printing Option */}
            <div
              className={`border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${
                selectedService === "3d-printing"
                  ? "border-pink-500 ring-2 ring-pink-300"
                  : "border-pink-200 hover:border-pink-300"
              }`}
              onClick={() => handleServiceSelect("3d-printing")}
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

            {/* Laser Cutting Option */}
            <div
              className={`border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${
                selectedService === "laser-cutting"
                  ? "border-pink-500 ring-2 ring-pink-300"
                  : "border-pink-200 hover:border-pink-300"
              }`}
              onClick={() => handleServiceSelect("laser-cutting")}
            >
              <div className="bg-pink-100 p-6 flex justify-center items-center">
                <div className="text-6xl">✂️</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-pink-500 mb-2">
                  Laser Cutting
                </h3>
                <p className="text-gray-800 mb-4">
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
          </div>

          <div className="mt-10 text-center">
            <button
              className={`bg-pink-500 text-white py-3 px-8 rounded-full text-lg font-semibold transition-all ${
                selectedService
                  ? "opacity-100 hover:bg-pink-600 hover:shadow-lg"
                  : "opacity-50 cursor-not-allowed"
              }`}
              disabled={!selectedService}
              onClick={handleContinue}
            >
              Continue to Details
            </button>
          </div>
        </div>
      </div>

      <footer className="bg-pink-100 py-4 text-center text-pink-500">
        <p>Questions? Contact us CUNEX call center at Tel: 02-008-6556</p>
      </footer>
    </div>
  );
}
