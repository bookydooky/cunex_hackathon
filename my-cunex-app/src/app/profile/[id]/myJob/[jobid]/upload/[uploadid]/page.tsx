"use client";
import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Share2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

const ImageUpload = () => {
  const params = useParams();
  const historyId = String(params.uploadid);
  const [imageSrc, setImageSrc] = useState<string | null>(null); // Explicitly set type
  const [file, setFile] = useState<File | null>(null); // Explicitly set type
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter(); // Don't forget to use the router for navigation
  const [acceptStatus, setAcceptStatus] = useState<boolean | null>(null); // Explicitly set type
  useEffect(() => {
    console.log("History Id: ", historyId);
    const fetchAcceptStatus = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/getJobStatus/${historyId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch job status");
        }
        const data = await response.json();
        setAcceptStatus(data.accept); // Set the accept status
      } catch (error) {
        console.error("Error fetching job status:", error);
      }
    };

    if (historyId) {
      fetchAcceptStatus();
    }
  }, [historyId]);
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    preventDefaults(e);

    const files = e.dataTransfer.files;
    if (files && files.length) {
      handleFiles(files); // Only handles the first file
    }
  };

  const preventDefaults = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFiles = (files: FileList) => {
    console.log("Files selected:", files);
    const selectedFile = files[0]; // Only take the first file
    if (selectedFile) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setImageSrc(fileReader.result as string); // Set image source to the file reader result (image URL)
        setFile(selectedFile); // Save the file object for submission
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      handleFiles(files); // Only handles the first file
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileSubmit = async () => {
    if (!file) {
      alert("Please select an image before submitting.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("files", file); // Append the single file

      const response = await fetch("/api/s3-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const { fileUrls } = await response.json();
      console.log("Uploaded file:", fileUrls);

      // Send fileUrls to your Node.js server (server.js)
      await sendToServer(fileUrls, historyId); // Pass bannerId here
      router.push("/");
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setFile(null); // Clear file after upload
    }
  };

  const sendToServer = async (fileUrls: string[], historyId: string) => {
    console.log("Sent History Id: ", historyId);
    try {
      const response = await fetch("http://localhost:3001/addSubmittedImages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ images: fileUrls, historyId }), // Use the passed bannerId
      });

      const result = await response.json();
      console.log("Server response:", result);
    } catch (error) {
      console.error("Error sending files to server:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="px-4 py-2 flex justify-between items-center bg-white">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="transition-transform transform active:scale-90"
          >
            <ArrowLeft className="mr-4 text-Pink hover:text-pink-800" />
          </button>
          <div className="flex items-center">
            <img
              src="/assets/CUNEX-logo.png"
              alt="CUNEX Logo"
              className="h-12"
            />
          </div>
          <div className="h-6 border-l border-gray-300 mx-5"></div>
          <div className="text-Pink font-medium text-xl">Upload Image</div>
        </div>
        <Share2 className="text-Gray" />
      </div>

      <div className="flex-1 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Upload Your Picture
          </h2>
          <p className="text-gray-600 mb-6">
            Select or drag and drop your image file below
          </p>

          <div
            className={`border-2 border-dashed rounded p-10 mb-6 cursor-pointer transition-colors border-gray-200 hover:border-pink-400 hover:bg-pink-50`}
            onClick={openFileDialog}
            onDrop={handleDrop}
          >
            <div className="text-4xl text-gray-300 mb-2">📁</div>
            <p className="text-gray-500">
              Drag & drop files here
              <br />
              or click to browse
            </p>
            {/* Display selected image if available */}
            {imageSrc && (
              <div className="mt-4">
                <img
                  src={imageSrc}
                  alt="Selected"
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileInputChange}
          />

          <button
            className={`font-medium w-full py-2 px-6 rounded-lg transition-colors ${
              acceptStatus === null
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-pink-500 hover:bg-pink-600 text-white transition-transform transform active:scale-90 active:bg-darkPink"
            }`}
            onClick={handleFileSubmit}
            disabled={acceptStatus === null}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
