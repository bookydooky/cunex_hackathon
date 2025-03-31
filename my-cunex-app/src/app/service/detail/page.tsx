"use client";
import { useState, useRef, useContext, useEffect } from "react";
import { FolderCheck } from 'lucide-react';
import { useRouter } from "next/navigation";
import { GlobalStateContext } from "@/app/context/GlobalState";
import { IoCloudUpload } from "react-icons/io5";

export default function UploadPagePreview() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { service } = useContext(GlobalStateContext);
  const [requestDetails, setRequestDetails] = useState({
    file: "",
    filename: "",
    material: "",
    specs: "",
    additional: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRequestDetails({ ...requestDetails, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    // Retrieve saved data from localStorage on page load
    const savedData = localStorage.getItem("requestDetails");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setRequestDetails(parsedData);

      // Retrieve the Base64 string and convert it to a Blob and File object
      if (parsedData.file) {
        const byteCharacters = atob(parsedData.file.split(",")[1]); // Decode Base64
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset++) {
          byteArrays.push(byteCharacters.charCodeAt(offset));
        }
        const byteArray = new Uint8Array(byteArrays);
        const blob = new Blob([byteArray], { type: "application/octet-stream" });
        const file = new File([blob], parsedData.filename, { type: "application/octet-stream" });
        setSelectedFile(file); // Reassign the file to show it in the UI
      }

      if (parsedData.material) {
        setSelectedMaterial(parsedData.material);
      }
    }
  }, []);

  const handleContinue = async () => {
    if (!selectedFile || !selectedMaterial || !requestDetails.specs.trim()) {
      alert(
        "Please upload a file, select a material, and enter specifications before continuing."
      );
      return;
    }

    let fileBase64 = "";

    if (selectedFile) {
      fileBase64 = await fileToBase64(selectedFile);
    }

    const updatedRequestDetails = {
      file: fileBase64,
      filename: selectedFile.name,
      material: selectedMaterial || "",
      specs: requestDetails.specs,
      additional: requestDetails.additional,
    };

    localStorage.setItem(
      "requestDetails",
      JSON.stringify(updatedRequestDetails)
    );
    router.push("/service/review");
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

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
      const file = files[0];
      setSelectedFile(file);
      fileToBase64(file).then((base64) => {
        const updatedRequestDetails = {
          ...requestDetails,
          file: base64,
          filename: file.name,
        };
        setRequestDetails(updatedRequestDetails); })
    }
  };

  const handleMaterialSelect = (materialId: string) => {
    setSelectedMaterial(materialId);
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-Pink mb-2">
            Fabrication Services
          </h1>
          <p className="text-xl text-Pink">Bring your ideas to life</p>
        </header>

        <div className="flex justify-between mb-8">
          <div className="flex-1 text-center px-4">
            <div className="w-10 h-10 rounded-full bg-pink-200 text-Pink flex items-center justify-center mx-auto mb-2 font-bold">
              1
            </div>
            <div className="text-gray-500 font-semibold">Start Order</div>
          </div>
          <div className="flex-1 text-center px-4">
            <div className="w-10 h-10 rounded-full bg-Pink text-white flex items-center justify-center mx-auto mb-2 font-bold">
              2
            </div>
            <div className="text-Pink font-semibold">Enter Details</div>
          </div>
          <div className="flex-1 text-center px-4">
            <div className="w-10 h-10 rounded-full bg-pink-200 text-Pink flex items-center justify-center mx-auto mb-2 font-bold">
              3
            </div>
            <div className="text-gray-500 font-semibold">Review & Pay</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-Gray">
            Enter Details
          </h2>

          <form>
            <div className="mb-6">
              <label
                className="block text-Pink font-semibold mb-2"
                htmlFor="file-upload"
              >
                {service == "3d"
                  ? "Upload your 3D model"
                  : "Upload your laser cutting design"}
              </label>
              <div
                className={`border-2 ${
                  selectedFile
                    ? "border-Pink bg-pink-50"
                    : "border-pink-200 border-dashed"
                } rounded-lg p-8 text-center cursor-pointer transition-all hover:border-Pink hover:bg-pink-50`}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex text-4xl text-Pink mb-2 justify-center">
                  {selectedFile ? <FolderCheck /> : <IoCloudUpload />}
                </div>
                {selectedFile ? (
                  <p className="text-Gray">
                    File selected: {selectedFile.name}
                  </p>
                ) : (
                  <>
                    <p className="mb-2 text-Gray">
                      Drag & drop your file here or click to browse
                    </p>
                    <p className="text-sm text-gray-600">
                      {service == "3d"
                        ? "Supported formats: STL"
                        : "Supported formats: DXF"}
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".stl,.obj,.3mf,.step,.fbx,.jpg,.jpeg,.png"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-Pink font-semibold mb-2">
                Material Preferences
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {materials.map((material) => (
                  <div
                    key={material.id}
                    className={`border-2 ${
                      selectedMaterial === material.id
                        ? "border-Pink bg-pink-50"
                        : "border-gray-300"
                    } rounded-lg p-4 text-center cursor-pointer transition-all hover:border-Pink hover:bg-pink-50`}
                    onClick={() => handleMaterialSelect(material.id)}
                  >
                    {/* <div className="text-2xl mb-2">{material.icon}</div> */}
                    <div className="text-Gray">{material.name}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label
                className="block text-Pink font-semibold mb-2"
                htmlFor="size"
              >
                Size & Specifications
              </label>
              <textarea
                id="size"
                name="specs"
                value={requestDetails.specs}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-Pink text-Gray"
                rows={3}
                placeholder="Please enter your desired dimensions, color, and any specific details about scale or measurements."
              ></textarea>
            </div>

            <div className="mb-6">
              <label
                className="block text-Pink font-semibold mb-2"
                htmlFor="additional"
              >
                Additional Requests
              </label>
              <textarea
                id="additional"
                name="additional"
                value={requestDetails.additional}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-Pink text-Gray"
                rows={4}
                placeholder="Enter any finishing requirements, painting instructions, special considerations or other notes for your project."
              ></textarea>
            </div>

            <button
              type="button"
              onClickCapture={handleContinue}
              className="w-full bg-Pink text-white py-3 px-6 rounded-lg text-lg font-medium
              hover:bg-darkPink active:bg-darkPink transition-colors"
            >
              Continue to Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
