"use client";
//buyerId, requestDate, serviceType, fileUrl, material, specs, additional, filename;
import { useRouter, useParams } from "next/navigation";
import Image from 'next/image';
import { useEffect, useState } from "react";
import { File, InspectionPanel, X } from 'lucide-react';
import ReloadWindow from "@/app/components/ReloadWindow";
export default function ReviewPaymentPage() {
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
  const router = useRouter();
  const params = useParams();
  const orderId = String(params.oid);
  const [projectDetails, setProjectDetails] = useState({
    buyerId: "",
    requestDate: "",
    serviceType: "",
    fileUrl: "",
    filename: "",
    material: "",
    materialIcon: "🔹",
    specs: "",
    additional: "",
    price: 67.5,
    firstName: "",
    lastName: "",
    studentYear: "",
    facultyNameEN: "",
    phoneNumber: "",
  });

  const [fullImage, setFullImage] = useState<boolean>(false);
  const totalPrice = projectDetails.price;
  useEffect(() => {
    // Fetch order details from the server using the orderId
    const fetchOrderDetails = async () => {
      try {
        const res = await fetch(`/api/getOrder/${orderId}`);
        const data = await res.json();
        setProjectDetails((prevDetails) => ({
          ...prevDetails,
          ...data.order,
        }));
      } catch (err) {
        console.error("Error viewing order:", err);
        alert("Error viewing order. Please try again later.");
      }
    };
    fetchOrderDetails();
  }, [orderId]);
  const handleAccept = async () => {
    const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage

    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }

    try {
      const response = await fetch(
        "/api/requestServices/userReceiveConfirmation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sellerId: userId,
            buyerId: projectDetails.buyerId,
            orderId: orderId,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        console.log("Notification sent successfully:", data);
        alert(
          "Request Accepted Successfully, your client will contact you back shortly. Please start working on your services!"
        );
        router.push("/");
      } else {
        console.error("Failed to send notification:", data);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const handleDeny = () => {
    // Go back to previous page or show cancellation message
    router.push("/");
  };
  if (projectDetails.buyerId == "") return <ReloadWindow detail="User" />;
  

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-Pink mb-2">
            Fabrication Services
          </h1>
          <p className="text-xl text-Pink">Bring your ideas to life</p>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Project Summary */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-Gray">
                Project Summary
              </h2>

              <div className="mb-2 p-4 bg-pink-50 rounded-lg border border-pink-100">
                <div className="flex items-center mb-4">
                  <div
                    className="text-3xl mr-3"
                    onClick={() => setFullImage(true)}
                  >
                    <File className="text-Pink cursor-pointer hover:text-darkPink active:text-darkPink"/>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Uploaded File</p>
                    <p className="text-Gray font-medium">
                      {projectDetails.filename}
                    </p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">
                    <InspectionPanel className="text-Pink cursor-pointer hover:text-darkPink active:text-darkPink"/>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Material</p>
                    <p className="text-Gray font-medium">
                      {projectDetails.material}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-600 text-sm">Size & Specifications</p>
                  <p className="text-Gray">{projectDetails.specs}</p>
                </div>

                <div className="mb-4">
                  <p className="text-gray-600 text-sm">Additional Requests</p>
                  <p className="text-Gray">{projectDetails.additional}</p>
                </div>

                <div className="mb-2">
                  <p className="text-gray-600 text-sm">Client Details</p>
                  <p className="text-Gray">
                    {projectDetails.firstName} {projectDetails.lastName}
                  </p>
                  <p className="text-Gray">
                    {getAcademicYearLevel(
                      parseInt(projectDetails.studentYear, 10),
                      2567
                    )}{" "}
                    {projectDetails.facultyNameEN}
                  </p>
                  <p className="text-Gray">{projectDetails.phoneNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-4">
              <h2 className="text-2xl font-semibold mb-6 text-Gray">
                Payment Summary
              </h2>

              <div className="space-y-3 mb-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Price:</span>
                  <span className="text-Gray">
                    ${projectDetails.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="text-Gray">
                    ${projectDetails.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-Gray">
                    ${projectDetails.price.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between font-bold">
                    <span className="text-Pink">Total:</span>
                    <span className="text-Pink">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* Accept/Deny Buttons */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleDeny}
              className="w-full bg-gray-200 text-gray-600  py-4 px-6 rounded-lg text-lg font-medium transition-colors hover:bg-gray-300 active:bg-gray-300"
            >
              Deny
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="w-full bg-Pink text-white py-4 px-6 rounded-lg text-lg font-medium transition-colors hover:bg-darkPink active:bg-darkPink"
            >
              Accept
            </button>
          </div>
        </div>
        {fullImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <button
              className="absolute top-2 right-2 text-red-400"
              onClick={() => setFullImage(false)}
            >
              <X/>
            </button>
            <Image
              src={projectDetails.fileUrl}
              alt={projectDetails.filename}
              width={1280}
              height={1280}
              className="max-h-[70vh] object-contain"
            />
        </div>
      )}
      </div>
  );
}
