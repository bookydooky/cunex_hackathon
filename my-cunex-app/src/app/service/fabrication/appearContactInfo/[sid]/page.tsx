import React from "react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import ReloadWindow from "@/app/components/ReloadWindow";
interface UserProfileResponse {
  firstName: string;
  lastName: string;
  facultyCode: string;
  studentYear: string;
  facultyNameEN: string;
  studentId: string;
  successRate: number;
  jobsSold: number;
  rehired: number;
  avgResponse: number;
  bio: string;
  rating: number;
  phoneNumber: string;
  profileImageUrl: string;
  bank: string;
  accountNumber: string;
}
export default function ContactPage() {
  const params = useParams();
  const sellerId = String(params.sid);

  const [sellerData, setSellerData] = useState<UserProfileResponse | null>(
    null
  );
  function getAcademicYearLevel(
    entryYear: number,
    currentAcademicYear: number
  ) {
    // Calculate the difference between current academic year and entry year
    const yearDifference = currentAcademicYear - entryYear;

    // Determine year level based on the difference
    if (yearDifference < 0) {
      return "Not yet enrolled";
    } else if (yearDifference === 0) {
      return "1st year";
    } else if (yearDifference === 1) {
      return "2nd year";
    } else if (yearDifference === 2) {
      return "3rd year";
    } else if (yearDifference === 3) {
      return "4th year";
    } else if (yearDifference === 4) {
      return "5th year";
    } else if (yearDifference > 4) {
      return "Advanced year / Graduate";
    }
  }
  useEffect(() => {
    if (!sellerId) return;

    const fetchUserDetail = async () => {
      try {
        const response = await fetch(`/api/getProfile/?userId=${sellerId}`);
        if (!response.ok) throw new Error("Failed to fetch job details");

        const data = await response.json();
        setSellerData(data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchUserDetail();
  }, [sellerId]);
  if (!sellerData) return <ReloadWindow detail="User" />;

  return (
    <div className="flex h-full items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 mx-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-Pink">
          Fabrication Service Provider
        </h1>
        <p className="text-gray-700 mt-2">
          Fabrication services for your needs.
        </p>

        <div className="mt-6 text-left">
          <p className="text-Gray font-semibold">📍 Address:</p>
          <p className="text-gray-600">
            123 Fabrication St., Industrial Area, Bangkok
          </p>

          <p className="text-Gray font-semibold mt-4">📞 Phone:</p>
          <p className="text-gray-600">{sellerData.phoneNumber}</p>

          <p className="text-Gray font-semibold mt-4">✉️ Email:</p>
          <p className="text-gray-600">
            {sellerData.studentId}@student.chula.ac.th
          </p>

          <p className="text-Gray font-semibold mt-4">🌐 Name:</p>
          <p className="text-gray-600">
            {sellerData.firstName} {sellerData.lastName}
          </p>

          <p className="text-Gray font-semibold mt-4">🌐 Name:</p>
          <p className="text-gray-600">
            {getAcademicYearLevel(parseInt(sellerData.studentYear, 10), 2567)}{" "}
            {sellerData.facultyNameEN}
          </p>
        </div>

        <button className="mt-6 w-full bg-Pink text-white py-2 px-4 rounded-lg hover:bg-darkPink transition">
          Contact Service Provider
        </button>
      </div>
    </div>
  );
}
