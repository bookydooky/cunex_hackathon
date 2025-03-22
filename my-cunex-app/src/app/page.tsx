"use client";
import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";
import { FiBox, FiPlus, FiEdit } from "react-icons/fi";
import { BiCube } from "react-icons/bi";
import { GiCutDiamond } from "react-icons/gi";
import { MdFoodBank, MdLocationOn } from "react-icons/md";
import { RiVideoAiFill } from "react-icons/ri";
import {
  FaCode,
  FaBell,
  FaPaintBrush,
  FaBook,
  FaLanguage,
  FaEllipsisH,
} from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoPersonSharp } from "react-icons/io5";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Notification from "./components/notification";
import axios from "axios";
import { GlobalStateContext } from "./context/GlobalState";

export default function Home() {
  interface Profile {
    userId: string;
    studentId: string;
    firstNameEN: string;
    lastNameEN: string;
    facultyCode: string;
    studentYear: string;
  }
  interface Job {
    bannerId: string;
    bannerName: string;
    price: number;
    typeOfWork: string;
    firstImageId: number;
    imageURL: string;
  }

  const { setService } = useContext(GlobalStateContext);
  const router = useRouter();
  const handleCreateJobClick = () => {
    if (profile?.userId) {
      router.push(`/create-job/${profile.userId}`);
    } else {
      console.warn("Profile is missing or incomplete.");
    }
  };
  const handleSeeAllClick = () => {
    if (profile?.userId) {
      router.push(`/seeAll/None/${profile.userId}`);
    } else {
      console.warn("Profile is missing or incomplete.");
    }
  };
  const handleServiceClick = (label: string) => {
    if (label.includes("3D Printing")) setService("3d");
    else if (label.includes("Laser Cutting")) setService("lasercut");
    router.push("/service/startorder");
  };
  const [latestJobs, setLatestJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    userId: "",
    studentId: "",
    firstNameEN: "",
    lastNameEN: "",
    facultyCode: "",
    studentYear: "",
  });

  useEffect(() => {
    // Fetch latest jobs when component mounts
    async function fetchLatestJobs() {
      try {
        // Use the correct server endpoint
        const response = await fetch(
          "/api/latest-jobs?typeOfWork=None&limit=3"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch latest jobs");
        }
        const data = await response.json();
        setLatestJobs(data.jobs);
      } catch (error) {
        console.error("Error fetching latest jobs:", error);
      } finally {
        setLoading(false);
      }
    }
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/fetchProfile");
        console.log("Profile fetched successfully:", response.data);
        setProfile(response.data);
      } catch (err) {
        console.log("Error fetching profile. Please try again.", err);
      }
    };
    fetchProfile();
    fetchLatestJobs();
    localStorage.removeItem("teamMembers");
    localStorage.removeItem("addedMembers");
    localStorage.removeItem("searchMembers");
  }, []);
  if (!profile) return <p>Loading user details...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Head>
        <title>CU FASTWORK</title>
        <meta name="description" content="CU FASTWORK App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <div className="bg-white p-4 shadow-md">
        <div className="flex justify-between items-center">
          <Image
            src="/assets/CUNEX-logo.png"
            alt="CUNEX Logo"
            width={48}
            height={48}
            className="h-12"
          />

          <div className="flex-1 mx-2">
            <div className="bg-gray-100 rounded-full px-3 py-2 flex items-center h-10 w-full">
              <input
                type="search"
                placeholder="What are you looking for?"
                className="text-gray-400 text-sm flex-1 bg-transparent outline-none"
              />
              <FaMagnifyingGlass className="text-gray-400" />
            </div>
          </div>
          <div className="flex space-x-2">
            <div
              className={`rounded-full p-2 flex items-center justify-center h-10 w-10 cursor-pointer transition-colors
              ${
                showNotifications
                  ? "bg-gray-300"
                  : "bg-gray-100 hover:bg-gray-300"
              }`}
              onClick={() => {
                if (profile?.userId) {
                  setShowNotifications(!showNotifications);
                } else {
                  console.warn("Profile is missing or incomplete.");
                }
              }}
            >
              <FaBell className="text-gray-400 text-lg" />
            </div>
            {showNotifications && (
              <Notification
                userId={profile.userId}
                setShowNotifications={setShowNotifications}
              />
            )}

            {/* Profile */}
            <div
              onClick={() => {
                if (profile?.userId) {
                  router.push(`/profile/${profile.userId}`);
                } else {
                  console.warn("Profile is missing or incomplete.");
                }
              }}
              className="bg-gray-100 rounded-full p-2 flex items-center justify-center h-10 w-10 cursor-pointer
            transition-transform hover:bg-gray-300 active:scale-90 active:bg-gray-300"
            >
              <IoPersonSharp className="text-gray-400 text-lg" />
            </div>
          </div>
        </div>
        {/* Location and Weather */}
        <div className="mt-2 text-sm text-Gray flex items-center">
          <MdLocationOn className="text-Pink" />
          <span className="ml-1">Chulalongkorn University</span>
          <TiWeatherPartlySunny className="ml-4 text-Pink" />
          <span className="ml-1">27°C</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* Service Categories */}
        <div className="grid gap-3 grid-cols-3 sm:grid-cols-3 md:grid-cols-4">
          {[
            { icon: FiEdit, label: "UX/UI", path: "UXUI" },
            { icon: FaCode, label: "Coding", path: "Coding" },
            { icon: FaPaintBrush, label: "Graphic", path: "Graphic" },
            { icon: RiVideoAiFill, label: "Video", path: "Video" },
            { icon: FaBook, label: "Tutoring", path: "Tutoring" },
            { icon: FaLanguage, label: "Language", path: "Language" },
            { icon: BiCube, label: "Modeling", path: "Modeling" },
            { icon: FaEllipsisH, label: "Others", path: "Others" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center"
              onClick={() => {
                if (profile?.userId) {
                  router.push(`/seeAll/${item.path}/${profile.userId}`);
                } else {
                  console.warn("Profile is missing or incomplete.");
                }
              }}
            >
              <div
                className="bg-pink-100 rounded-full p-4 w-16 h-16 flex items-center justify-centerbg-pink-100 hover:bg-pink-200 rounded-full p-4 w-16 h-16 flex items-center justify-center
              transition-transform transform active:scale-90 transition-colors active:bg-pink-200"
              >
                <item.icon className="text-Pink text-2xl" />
              </div>
              <span className="text-xs text-Gray mt-1 text-center">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Request Services */}
        <div className="mt-6 bg-white px-4 py-3 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-lg text-Gray font-bold mb-2">
              Request Services
            </h2>
          </div>
          <div className="flex overflow-x-auto space-x-10 pb-2 justify-center">
            {[
              { icon: FiBox, label: "Item Delivery" },
              { icon: MdFoodBank, label: "Food Delivery" },
              { icon: BiCube, label: "3D Printing" },
              { icon: GiCutDiamond, label: "Laser Cutting" },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div
                  onClick={() => handleServiceClick(item.label)}
                  className="bg-gray-200 hover:bg-gray-300 rounded-full p-4 w-14 h-14 flex items-center justify-center
                transition-transform transform active:scale-90 transition-colors active:bg-gray-300"
                >
                  <item.icon className="text-Gray text-2xl" />
                </div>
                <span className="text-xs text-Gray mt-1 text-center">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Jobs */}
        <div className="mt-6 mb-15 mx-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg text-Gray font-bold mb-2">Latest Jobs</h2>
            <h2
              className="text-sm text-Pink font-bold mb-2 hover:underline cursor-pointer
              active:underline"
              onClick={handleSeeAllClick}
            >
              See All
            </h2>
          </div>
          <div className="flex overflow-x-auto space-x-3 pb-2">
            <div className="w-24 h-24 bg-pink-100 rounded-lg flex items-center justify-center">
              <button
                onClick={handleCreateJobClick}
                className="transition-transform transform hover:scale-110 active:scale-90"
              >
                <FiPlus className="text-Pink text-3xl" />
              </button>
            </div>
            {loading
              ? // Show loading placeholders
                Array(3)
                  .fill(0)
                  .map((_, idx) => (
                    <div
                      key={idx}
                      className="w-24 h-24 bg-gray-200 rounded-lg animate-pulse"
                    ></div>
                  ))
              : // Show actual jobs from database with click handler
                latestJobs.map((job, idx) => (
                  <div
                    key={job.bannerId}
                    className="flex flex-col items-center w-24"
                  >
                    <div
                      className="w-24 h-24 bg-white rounded-lg overflow-hidden cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/work/workdetail/${job.bannerId}/${profile.userId}`
                        )
                      }
                    >
                      <Image
                        src={job.imageURL}
                        alt={job.bannerName || `Job ${idx}`}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement; // Type assertion
                          target.onerror = null; // Prevent infinite loop in case the placeholder fails
                          target.src = "/placeholder.png";
                        }}
                      />
                    </div>
                    <span className="text-xs text-Gray mt-1 text-center">
                      {job.bannerName}
                    </span>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
