"use client";
import { useState, useRef, useContext } from "react";
import { useRouter } from 'next/navigation'
import { GlobalStateContext } from "@/app/context/GlobalState";

export default function UploadPagePreview() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { service }  = useContext(GlobalStateContext);

  const materials = [
    { id: "pla", name: "PLA", icon: "🔹" },
    { id: "abs", name: "ABS", icon: "🔷" },
    { id: "resin", name: "Resin", icon: "💎" },
    { id: "acrylic", name: "Acrylic", icon: "✨" },
    { id: "petg", name: "PETG", icon: "🌈" },
    { id: "nylon", name: "Nylon", icon: "⚙️" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleMaterialSelect = (materialId: string) => {
    setSelectedMaterial(materialId);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-pink-500 mb-2">
            Fabrication Services
          </h1>
          <p className="text-xl text-pink-400">Bring your ideas to life</p>
        </header>

        <div className="flex justify-between mb-8">
          <div className="flex-1 text-center px-4">
            <div className="w-10 h-10 rounded-full bg-pink-200 text-pink-500 flex items-center justify-center mx-auto mb-2 font-bold">
              1
            </div>
            <div className="text-gray-800 font-semibold">Start Order</div>
          </div>
          <div className="flex-1 text-center px-4">
            <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center mx-auto mb-2 font-bold">
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

        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Enter Details
          </h2>

          <form>
            <div className="mb-6">
              <label
                className="block text-pink-500 font-semibold mb-2"
                htmlFor="file-upload"
              >
                {service == '3d' ? 'Upload your 3D model' : 'Upload your laser cutting design'}
              </label>
              <div
                className={`border-2 ${
                  selectedFile
                    ? "border-pink-500 bg-pink-50"
                    : "border-pink-200 border-dashed"
                } rounded-lg p-8 text-center cursor-pointer transition-all hover:border-pink-500 hover:bg-pink-50`}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-4xl mb-4">
                  {selectedFile ? "✅" : "📤"}
                </div>
                {selectedFile ? (
                  <p className="text-gray-800">
                    File selected: {selectedFile.name}
                  </p>
                ) : (
                  <>
                    <p className="mb-2 text-gray-800">
                      Drag & drop your file here or click to browse
                    </p>
                    <p className="text-sm text-gray-600">
                      {service == '3d' ? 'Supported formats: STL' :
                      'Supported formats: DXF'}
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".stl,.obj,.3mf,.step,.fbx"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-pink-500 font-semibold mb-2">
                Material Preferences
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {materials.map((material) => (
                  <div
                    key={material.id}
                    className={`border-2 ${
                      selectedMaterial === material.id
                        ? "border-pink-500 bg-pink-50"
                        : "border-pink-200"
                    } rounded-lg p-4 text-center cursor-pointer transition-all hover:border-pink-500 hover:bg-pink-50`}
                    onClick={() => handleMaterialSelect(material.id)}
                  >
                    <div className="text-2xl mb-2">{material.icon}</div>
                    <div className="text-gray-800">{material.name}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label
                className="block text-pink-500 font-semibold mb-2"
                htmlFor="size"
              >
                Size & Specifications
              </label>
              <textarea
                id="size"
                name="size"
                className="w-full p-3 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 text-gray-800"
                rows={3}
                placeholder="Please enter your desired dimensions, color, and any specific details about scale or measurements."
              ></textarea>
            </div>

            <div className="mb-6">
              <label
                className="block text-pink-500 font-semibold mb-2"
                htmlFor="additional"
              >
                Additional Requests
              </label>
              <textarea
                id="additional"
                name="additional"
                className="w-full p-3 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 text-gray-800"
                rows={4}
                placeholder="Enter any finishing requirements, painting instructions, special considerations or other notes for your project."
              ></textarea>
            </div>

            <button
              type="button"
              onClickCapture={() => router.push("/service/review")}
              className="w-full bg-pink-500 text-white py-3 px-6 rounded-full text-lg font-semibold transition-transform transform hover:bg-pink-600 hover:shadow-lg active:scale-90"
            >
              Continue to Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
