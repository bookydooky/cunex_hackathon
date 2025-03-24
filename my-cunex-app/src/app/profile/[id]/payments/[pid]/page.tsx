"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
const PaymentPage = () => {
  const router = useRouter();
  const params = useParams();
  const userId = String(params.pid);
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [bank, setBank] = useState<string>("Kasikorn");

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBank(e.target.value);
  };
  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAccountNumber(e.target.value);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      alert("Phone number must be 10 characters long.");
      return;
    }

    if (!phoneNumber || !accountNumber || !bank) {
      alert(
        "All fields (Phone Number, Account Number, and Bank) must be filled out."
      );
      return;
    }

    // Prepare data to send
    const paymentData = {
      userId,
      accountNumber,
      phoneNumber,
      bank,
    };

    try {
      // API Call to /api/submitPayment
      const response = await fetch("/api/submitPayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      // Check if the submission was successful
      if (response.ok) {
        // Redirect to the homepage after success
        router.push("/");
      } else {
        console.error("Failed to submit payment data.");
        // Handle error case here, like showing an error message to the user
      }
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle network or other errors
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="sticky top-0 right-0 left-0 px-4 py-2 flex justify-between items-center bg-white">
        <div className="flex items-center">
          <button
            onClick={() => router.push("/")}
            className="transition-transform transform active:scale-90"
          >
            <ArrowLeft className="mr-4 text-Pink hover:text-darkPink active:text-darkPink" />
          </button>
          <Image
            src="/assets/CUNEX-logo.png"
            alt="CUNEX Logo"
            width={48}
            height={48}
            className="h-12"
          />
          <div className="h-6 border-l border-gray-300 mx-5"></div>
          <div className="text-Pink font-medium text-xl">Profile</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md flex-grow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Payment Details
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
          {/* Bank Account Details */}
          <div className="mb-4">
            <h3 className="font-medium text-lg mb-2 text-gray-800">
              Bank Account
            </h3>
            <label htmlFor="bank" className="block text-gray-500 mb-2">
              Select Bank Account
            </label>
            <select
              id="bank"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-gray-500"
              onChange={handleBankChange}
            >
              <option value="Kasikorn">Kasikorn</option>
              <option value="SCB">SCB</option>
              <option value="Krungthai">Krungthai</option>
              <option value="Bangkok Bank">Bangkok Bank</option>
              <option value="Krungsri">Krungsri</option>
            </select>

            <label
              htmlFor="account-number"
              className="block text-gray-500 mb-2"
            >
              Enter Account Number
            </label>
            <input
              type="text"
              id="account-number"
              value={accountNumber}
              onChange={handleAccountNumberChange}
              placeholder="Enter Account Number"
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-500"
            />
          </div>

          {/* PromptPay Details */}
          <div className="mb-4 flex-grow">
            <h3 className="font-medium text-lg mb-2 text-gray-800">
              PromptPay
            </h3>
            <label htmlFor="phone-number" className="block text-gray-500 mb-2">
              Enter Phone Number
            </label>
            <input
              type="text"
              id="phone-number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="0123456789"
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 mt-auto"
          >
            Submit Payment Details
          </button>
        </form>
      </div>
    </div>
  );
};
export default PaymentPage;
