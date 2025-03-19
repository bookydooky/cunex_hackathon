"use client";
import React, { useState } from "react";
import { IoCloudUpload } from "react-icons/io5";
import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Portfolio() {
  const [portfolioItems, setPortfolioItems] = useState<File[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  //Chien
  const [files, setFiles] = useState([]); // Store multiple files

  const [uploading, setUploading] = useState(false);

  const [bannerId, setbannerId] = useState(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const filePreviews = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file), // Create a preview URL for the file
    }));

    setFiles((prevFiles) => [...prevFiles, ...filePreviews]); // Add new files
  };

  const handleFileSubmit = async (bannerId) => {
    if (files.length === 0) {
      console.error("No files selected for upload");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file.file);
      });

      const response = await fetch("/api/s3-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload files");
      }

      const { fileUrls } = await response.json();
      console.log("Uploaded files:", fileUrls);

      // Send fileUrls to your Node.js server (server.js)
      await sendToServer(fileUrls, bannerId); // Pass bannerId here
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setUploading(false);
      setFiles([]); // Clear files after upload
    }
  };

  const sendToServer = async (fileUrls, bannerId) => {
    console.log("Sent Banner Id: ", bannerId);
    try {
      const response = await fetch("http://localhost:3001/addImages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ images: fileUrls, bannerId }), // Use the passed bannerId
      });

      const result = await response.json();
      console.log("Server response:", result);
    } catch (error) {
      console.error("Error sending files to server:", error);
    }
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((_, i) => i !== index);
      URL.revokeObjectURL(prevFiles[index].preview); // Free memory
      return updatedFiles;
    });
  };

  const handleAddPortfolio = async () => {
    const jobDetails = JSON.parse(localStorage.getItem("jobDetails") || "{}");
    const workData = {
      workTitle: jobDetails.workTitle || "Untitled",
      workType: jobDetails.workType || "Unknown",
      price: jobDetails.price || "0",
      duration: jobDetails.duration || "0",
      description: jobDetails.description || "No description",
    };

    console.log("Sending data to server:", workData);

    try {
      const response = await fetch("http://localhost:3001/addPortfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workData),
      });
      const result = await response.json();
      console.log("Server response:", result);

      if (result.bannerId) {
        setbannerId(result.bannerId); // Still update the state for other uses
      }

      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 3000); // Hide the pop-up after 3 seconds

      setTimeout(() => {
        router.push("/");
      }, 1500);

      return result; // Return the result to get the bannerId
    } catch (error) {
      console.error("Error submitting portfolio:", error);
      throw error; // Re-throw to handle in the calling function
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page refresh

    try {
      const portfolioResult = await handleAddPortfolio(); // Then submit portfolio data
      const bannerId = portfolioResult?.bannerId; // Get the bannerId directly from the result
      await handleFileSubmit(bannerId); // Pass the bannerId to handleFileSubmit
    } catch (error) {
      console.error("Error submitting portfolio:", error);
    }
  };
  //---------------------------------------------------------------------

  const handlePreviousPage = () => {
    router.push("/create-job");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation bar */}
      <div className="px-4 py-5 flex justify-between items-center bg-white">
        <div className="flex items-center">
          <button
            onClick={handlePreviousPage}
            className="transition-transform transform active:scale-90"
          >
            <ArrowLeft className="mr-4 text-pink-500 hover:text-pink-800" />
          </button>
          <div className="flex items-center">
            <span className="text-pink-500 font-semibold text-xl">CU</span>
            <span className="text-gray-800 font-bold text-xl">NEX</span>
          </div>
          <div className="h-6 border-l border-gray-300 mx-5"></div>
          <div className="text-pink-500 font-medium text-xl">Portfolio</div>
          <div className="h-6 border-l border-gray-300 mx-5"></div>
          <div className="text-pink-500 font-medium text-xl">Portfolio</div>
        </div>
        <button className="text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </button>
      </div>

      {/* Divider lines */}
      <div className="flex px-4 mt-4">
        <div className="h-1 bg-pink-500 flex-1 rounded-full mr-2"></div>
        <div className="h-1 bg-pink-500 flex-1 rounded-full ml-2"></div>
      </div>

      {/* Main content */}
      <div className="px-4 py-6">
        {/* Info box */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8">
          <h2 className="text-xl text-black font-bold mb-2">
            Portfolio and Examples
          </h2>
          <p className="text-gray-600">
            These pictures will provide the customers a brief view of what kind
            of product/service they will receive. You can also attach your
            portfolio for your own creditibility.
          </p>

          {/* Upload area */}

          <div className="border-2 border-dashed border-pink-300 rounded-lg p-6 mt-4 flex flex-col items-center justify-center">
            <div className="text-pink-500 mb-2">
              <IoCloudUpload className="text-4xl" />
            </div>
            <p className="text-gray-500 text-center mb-4">
              Click to upload documents, images, or files
            </p>
            <label
              htmlFor="file-upload"
              className="bg-pink-500 text-white px-6 py-2 rounded-md cursor-pointer
            transition-transform transition-colors transform hover:scale-105 active:scale-95 duration-200 ease-in-out hover:bg-pink-600 active:bg-pink-700"
            >
              Upload Files
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Portfolio grid */}
        <h2 className="text-xl text-black font-bold mb-4">
          Your Portfolio Previews
        </h2>
        {files.length === 0 ? (
          <p className="text-gray-500 text-center mb-4">
            No portfolio items added yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {files.map((file, index) => (
              <div
                key={index}
                className="border-2 rounded-lg p-2 flex flex-col items-center"
              >
                <div className="w-full h-24 bg-gray-200 rounded-md mb-2 flex items-center justify-center relative">
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                  <img
                    src={file.preview}
                    alt={`Portfolio Item ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md mb-2"
                  />
                  <p className="text-sm text-gray-600">{file.name}</p>
                </div>
                <p className="text-sm text-gray-600">
                  Portfolio Item {index + 1}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Add portfolio button */}
        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            disabled={files.length === 0} // Disable button if no files are uploaded
            className={`w-full py-4 rounded-lg text-lg font-semibold transition-colors duration-200 ease-in-out
    ${
      files.length === 0
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-pink-500 text-white hover:bg-pink-600 active:bg-pink-700"
    }`}
          >
            Submit Portfolio
          </button>
        </form>
      </div>
      {showPopup && files.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
          Portfolio item successfully added!
        </div>
      )}
      {showPopup && files.length == 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg">
          Can't add empty portfolio!
        </div>
      )}
    </div>
  );
}
