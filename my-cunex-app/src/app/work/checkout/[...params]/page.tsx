"use client";
import { ArrowLeft } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import ReloadWindow from "@/app/components/ReloadWindow";
import { FiClipboard } from "react-icons/fi"

interface JobDetailResponse {
  bannerId: string;
  userId: string;
  bannerName: string;
  price: number;
  duration: string; // Duration in days, or another appropriate unit
  typeOfWork: string;
  bannerdesc: string;
  bank: string;
  accountNumber: string;
  phoneNumber: string;
  images: string[]; // Array of image URLs
}

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const router = useRouter();
  const params = useParams();
  const [bannerId, userId] = params?.params || []; // ✅ Get id dynamically
  const [jobData, setJobData] = useState<JobDetailResponse | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    if (!bannerId) return;

    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`/api/jobDetails/${bannerId}`);
        if (!response.ok) throw new Error("Failed to fetch job details");

        const data = await response.json();
        setJobData(data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchJobDetails();
  }, [bannerId]);

  if (!jobData) return <ReloadWindow detail='Job' />;

  const handleAddPortfolio = async () => {
    try {
      const response = await fetch(`/api/confirmJob`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bannerId: bannerId,
          userId: userId, // Ensure userId is included
          sellerId: jobData.userId,
        }),
      });
      const result = await response.json();
      console.log("Server response:", result);
      setShowModal(true);
      setTimeout(() => { setShowModal(false);
      router.push("/"); }
      , 2000);
    } catch (error) {
      console.error("Error Requesting Job", error);
      throw error; // Re-throw to handle in the calling function
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopySuccess('Copied to clipboard!');
        setTimeout(() => setCopySuccess(''), 2000); // Clear the message after 2 seconds
      },
      (err) => {
        setCopySuccess('Failed to copy!');
      }
    );
  };

  return (
    <div className="h-screen bg-white">
      {/* App Header */}
      <div className="sticky top-0 left-0 right-0 px-4 py-2 flex items-center justify-between bg-white">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="transition-transform transform active:scale-90"
          >
            <ArrowLeft className="mr-4 text-Pink hover:text-darkPink active:text-darkPink" />
          </button>
          <div className="flex items-center">
            <Image
              src="/assets/CUNEX-logo.png"
              alt="CUNEX Logo"
              width={48}
              height={48}
              className="h-12"
            />
            <div className="h-6 border-l border-gray-300 mx-5"></div>
            <div className="text-Pink text-xl font-medium">Checkout</div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="px-6 py-4 bg-gray-50">
        <h2 className="text-xl font-bold text-Gray mb-4">Order Summary</h2>
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-white border border-pink-300 flex items-center justify-center mr-4">
            <svg
              viewBox="0 0 24 24"
              className="w-8 h-8 text-Pink"
              fill="none"
              stroke="currentColor"
            >
              <path d="M12 4C6.48 4 2 8.48 2 14s4.48 10 10 10 10-4.48 10-10S17.52 4 12 4zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              <path d="M16 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm-8 0c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-Gray">{jobData.bannerName}</h3>
            <div className="text-sm text-gray-600">
              <p>Type: {jobData.typeOfWork}</p>
              <p>Duration: {jobData.duration}</p>
            </div>
          </div>
          <div className="text-gray-800 font-medium">{jobData.price} THB</div>
        </div>
        <div className="flex justify-between pt-4 border-t border-gray-500">
          <span className="font-bold text-Pink">Total</span>
          <span className="font-bold text-Pink">{jobData.price} THB</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-Gray mb-4">Method</h2>
        <div
          className={`border rounded-lg p-4 mb-3 flex justify-between items-center cursor-pointer ${
            paymentMethod === "Bank Account" ? "border-Pink" : "border-gray-300"
          }`}
          onClick={() => setPaymentMethod("Bank Account")}
        >
          <div className="flex items-center">
            <div
              className={`w-5 h-5 rounded-full border mr-2 flex items-center justify-center ${
                paymentMethod === "Bank Account"
                  ? "border-Pink"
                  : "border-gray-300"
              }`}
            >
              {paymentMethod === "Bank Account" && (
                <div className="w-3 h-3 rounded-full bg-Pink"></div>
              )}
            </div>
            <span
              className={`${
                paymentMethod === "Bank Account" ? "text-Pink" : "text-gray-300"
              }`}
            >
              Bank Account
            </span>
          </div>
        </div>

        <div
          className={`border rounded-lg p-4 mb-3 flex justify-between items-center cursor-pointer ${
            paymentMethod === "PromptPay" ? "border-Pink" : "border-gray-300"
          }`}
          onClick={() => setPaymentMethod("PromptPay")}
        >
          <div className="flex items-center">
            <div
              className={`w-5 h-5 rounded-full border mr-2 flex items-center justify-center ${
                paymentMethod === "PromptPay"
                  ? "border-Pink"
                  : "border-gray-300"
              }`}
            >
              {paymentMethod === "PromptPay" && (
                <div className="w-3 h-3 rounded-full bg-Pink"></div>
              )}
            </div>
            <span
              className={`${
                paymentMethod === "PromptPay" ? "text-Pink" : "text-gray-300"
              }`}
            >
              PromptPay
            </span>
          </div>
          <img src='https://www.designil.com/wp-content/uploads/2020/04/prompt-pay-logo.png'
            className='h-[30px]'/>
        </div>
        {paymentMethod === "PromptPay" && (
        <div className="flex justify-between items-center px-4 py-2 mb-4 bg-gray-100 rounded-lg">
          <span className="text-gray-700">
            Account Number: {jobData.phoneNumber}
          </span>
          <button onClick={() => handleCopyToClipboard(jobData.phoneNumber)}>
            <FiClipboard className="text-gray-500 hover:text-Gray active:text-Gray"/>
          </button>
        </div>
      )}
      {paymentMethod === "Bank Account" && (
        <div className="flex justify-between items-center px-4 py-2 mb-4 bg-gray-100 rounded-lg">
          <span className="text-gray-700">
            Account Number: {jobData.bank} {jobData.accountNumber}
          </span>
          <button onClick={() => handleCopyToClipboard(jobData.accountNumber)}
            className="ml-2">
            <FiClipboard className="text-gray-500 hover:text-Gray active:text-Gray"/>
          </button>
        </div>
      )}
      </div>
      
      {/* Confirm Payment Button */}
      <div className="p-4 bg-white">
        <button
          className="w-full bg-Pink text-white py-4 rounded-lg font-medium text-lg hover:bg-darkPink
          active:bg-darkPink"
          onClick={handleAddPortfolio}
        >
          Confirm Payment
        </button>
      </div>
      {showModal && (
        <div className="flex justify-center">
          <div className="fixed bottom-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg font-medium">
              Payment Confirmed!
          </div>
        </div>
      )}
      {copySuccess && (
            <div className="flex justify-center">
              <div className="fixed bottom-4 bg-gray-100 text-Gray px-4 py-2 rounded-md shadow-lg font-medium">
                {copySuccess}
              </div>
            </div>
      )}
    </div>
  );
}
