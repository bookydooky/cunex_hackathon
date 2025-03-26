"use client";
//buyerId, requestDate, serviceType, fileUrl, material, specs, additional, filename;
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReloadWindow from "@/app/components/ReloadWindow";
export default function ReviewPaymentPage() {
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
  });

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
      const response = await fetch("/api/userRecieveConfirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Notification sent successfully:", data);
        router.push("/service/fabrication/3d/confirmation");
      } else {
        console.error("Failed to send notification:", data);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const handleDeny = () => {
    // Go back to previous page or show cancellation message
    router.push("/service/fabrication/3d/details");
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

        <div className="grid md:grid-cols-3 gap-6">
          {/* Project Summary */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
              <h2 className="text-2xl font-semibold mb-6 text-Gray">
                Project Summary
              </h2>

              <div className="mb-6 p-4 bg-pink-50 rounded-lg border border-pink-100">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">📁</div>
                  <div>
                    <p className="text-gray-600 text-sm">Uploaded File</p>
                    <p className="text-Gray font-medium">
                      {projectDetails.filename}
                    </p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">
                    {projectDetails.materialIcon}
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

                <div className="mb-2">
                  <p className="text-gray-600 text-sm">Additional Requests</p>
                  <p className="text-Gray">{projectDetails.additional}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 my-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.push("/service/fabrication/3d/details")}
                  className="text-Pink font-medium hover:underline flex items-center"
                ></button>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-6 sticky top-4">
              <h2 className="text-2xl font-semibold mb-6 text-Gray">
                Payment Summary
              </h2>

              <div className="space-y-3 mb-6">
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
                    <span className="text-Gray">Total:</span>
                    <span className="text-Pink">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method - Demo */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-Gray">
            Payment Method
          </h2>

          <div className="p-4 mb-6 bg-pink-50 rounded-lg border border-pink-100 flex items-center">
            <div className="text-2xl mr-3">💳</div>
            <div className="text-Gray font-medium">Credit Card</div>
          </div>

          {/* Demo Credit Card Details */}
          {/* <div className="bg-gray-100 rounded-lg p-6 mb-8 border border-gray-200">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-Gray mb-1">
                Demo Payment Information
              </h3>
              <p className="text-gray-600 text-sm">
                For demonstration purposes only
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
              <div className="flex justify-between items-center mb-6">
                <div className="text-lg font-bold text-Gray">Demo Card</div>
                <div className="flex space-x-2">
                  <div className="h-6 w-10 bg-blue-500 rounded"></div>
                  <div className="h-6 w-10 bg-red-500 rounded"></div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500">Card Number</p>
                <p className="font-mono text-Gray">**** **** **** 4242</p>
              </div>

              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-gray-500">Cardholder Name</p>
                  <p className="text-Gray">John Doe</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Expires</p>
                  <p className="text-Gray">12/25</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Card Type:</span>
                <span className="text-Gray">MasterCard</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Billing Address:</span>
                <span className="text-Gray">123 Main St, Anytown</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Amount:</span>
                <span className="font-semibold text-Pink">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div> */}

          {/* Accept/Deny Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleDeny}
              className="w-full bg-gray-100 text-gray-400 py-4 px-6 rounded-full text-lg font-semibold transition-transform transform hover:bg-gray-200 active:scale-90"
            >
              Deny
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="w-full bg-Pink text-white py-4 px-6 rounded-full text-lg font-semibold transition-transform transform hover:bg-darkPink hover:shadow-lg active:scale-90"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
