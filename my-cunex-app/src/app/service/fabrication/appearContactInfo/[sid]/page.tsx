"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Phone, Mail } from 'lucide-react';
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
  const router = useRouter();
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
    <div className="flex p-8 h-full items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full text-center">
        <h1 className="text-2xl font-bold text-Pink">
          Fabrication Service Provider
        </h1>
        <p className="text-gray-700">
          Fabrication services for your needs.
        </p>

        <div className="mt-6 text-left text-xl">
          <div className="flex gap-1 text-Gray items-center font-semibold">
            <MapPin size={20}/>
            <h1>Address</h1>
          </div>
          <p className="text-gray-600 text-lg">
            123 Fabrication St., Industrial Area, Bangkok
          </p>

          <div className="flex gap-1 text-Gray items-center font-semibold mt-4">
            <Phone size={20}/>
            <h1>Phone</h1>
          </div>
          <p className="text-gray-600 text-lg">{sellerData.phoneNumber}</p>

          <div className="flex gap-1 text-Gray items-center font-semibold mt-4">
            <Mail size={20}/>
            <h1>Email</h1>
          </div>
          <p className="text-gray-600 text-lg">
            {sellerData.studentId}@student.chula.ac.th
          </p>

          <p className="text-Gray font-semibold mt-4">Name</p>
          <p className="text-gray-600 text-lg">
            {sellerData.firstName} {sellerData.lastName}
          </p>

          <p className="text-Gray font-semibold mt-4">Faculty</p>
          <p className="text-gray-600 text-lg">
            {getAcademicYearLevel(parseInt(sellerData.studentYear, 10), 2567)}{" "}
            {sellerData.facultyNameEN}
          </p>
        </div>

        <button onClick={() => router.push("/chatpage")}
        className="mt-6 w-full bg-Pink text-white py-3 px-4
        rounded-lg hover:bg-darkPink transition">
          Contact Service Provider
        </button>
      </div>
    </div>
  );
}
