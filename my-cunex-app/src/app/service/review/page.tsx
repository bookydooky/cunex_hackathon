"use client";
import { useState, useContext } from "react";
import { GlobalStateContext } from "@/app/context/GlobalState";
import { useRouter } from "next/navigation";
import { FiClipboard } from "react-icons/fi";
import { useEffect } from "react";
export default function ReviewAndPayPage() {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [userId, setUserId] = useState("");
  //const userId = localStorage.getItem("userId") || "";

  const [copySuccess, setCopySuccess] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { service } = useContext(GlobalStateContext);
  const router = useRouter();
  const promtpay = "092-XXX-XXX";
  const bankaccount = "038-xxxxxx-x";
  const [requestDetails, setRequestDetails] = useState({
    file: "",
    filename: "",
    material: "",
    specs: "",
    additional: "",
  });
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId") || "";
    setUserId(storedUserId);
    const storedData = localStorage.getItem("requestDetails");
    if (storedData) {
      setRequestDetails(JSON.parse(storedData)); // Convert JSON string to object
    }
  }, []);
  const sendNotification = async (orderId: number) => {
    try {
      const response = await fetch("/api/requestServices/userSendRequest", {
        method: "POST",
        body: JSON.stringify({ userId, orderId }),
      });
      alert("Order submitted successfully! Redirecting to home page...");
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("No Student available to take your order, Please Try again Later");
    }
  };
  const handleFileSubmit = async () => {
    if (!requestDetails.file) {
      alert("Please select an image before submitting.");
      return;
    }

    try {
      const base64ToFile = (
        base64String: string,
        fileName: string,
        mimeType: string
      ): File => {
        const byteString = atob(base64String.split(",")[1]); // Decode Base64
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
          uint8Array[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([uint8Array], { type: mimeType });
        return new File([blob], fileName, { type: mimeType });
      };
      const file = base64ToFile(
        requestDetails.file,
        requestDetails.filename,
        "image/jpeg"
      );

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

      const orderId = await sendToServer(fileUrls); // Pass bannerId here
      await sendNotification(orderId);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setRequestDetails({
        file: "",
        filename: "",
        material: "",
        specs: "",
        additional: "",
      }); // Clear file after upload
    }
  };

  const sendToServer = async (fileUrls: string[]) => {
    if (!userId) {
      console.error("User ID is missing.");
      return;
    }

    const payload = {
      userId,
      serviceType: orderDetails.service,
      fileUrl: fileUrls[0], // Assuming only one file, adjust if multiple
      filename: orderDetails.filename,
      material: orderDetails.material,
      specs: orderDetails.specs,
      additional: orderDetails.additionalRequests,
    };

    console.log("Sending order data:", payload);

    try {
      const response = await fetch("/api/requestServices/submitOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Server response:", result);
      return result.orderId;
    } catch (error) {
      console.error("Error sending order to server:", error);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopySuccess('Copied to clipboard!');
        setTimeout(() => setCopySuccess(''), 2000); // Clear the message after 2 seconds
      },
      (err) => {
        setCopySuccess("Failed to copy!");
      }
    );
  };

  // Sample order data that would come from previous steps
  const orderDetails = {
    service: service === "3d" ? "3D Printing" : "Laser Cutting",
    filename: requestDetails.filename,
    material: requestDetails.material,
    specs: requestDetails.specs,
    additionalRequests:
      requestDetails.additional || "No additional requests specified",
    estimatedPrintTime: "4 hours 25 minutes",
    pricing: {
      baseCost: 45.0,
      materialCost: 12.5,
      additionalServices: 5.0,
      subtotal: 62.5,
      tax: 5.0,
      total: 67.5,
    },
  };

  if (service == "lasercut") {
    orderDetails.service = "Laser Cutting";
    orderDetails.filename = "custom-sign.dxf";
  }

  const handleSubmitOrder = () => {
    console.log(orderDetails);
    handleFileSubmit();
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
      router.push("/");
    }, 2000);
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-Pink mb-2">
            Fabrication Service
          </h1>
          <p className="text-xl text-Pink">
            Review your order and complete payment
          </p>
        </header>

        <div className="flex justify-between mb-8">
          <div className="flex-1 text-center px-4">
            <div className="w-10 h-10 rounded-full bg-pink-200 text-Pink flex items-center justify-center mx-auto mb-2 font-bold">
              1
            </div>
            <div className="text-gray-500 font-semibold">Start Order</div>
          </div>
          <div className="flex-1 text-center px-4">
            <div className="w-10 h-10 rounded-full bg-pink-200 text-Pink flex items-center justify-center mx-auto mb-2 font-bold">
              2
            </div>
            <div className="text-gray-500 font-semibold">Enter Details</div>
          </div>
          <div className="flex-1 text-center px-4">
            <div className="w-10 h-10 rounded-full bg-Pink text-white flex items-center justify-center mx-auto mb-2 font-bold">
              3
            </div>
            <div className="text-Pink font-semibold">Review & Pay</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-Gray">
            Order Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Order Details Column */}
            <div className="col-span-1">
              <div className="border-b border-pink-100 pb-4 mb-4">
                <h3 className="text-lg font-semibold text-Pink mb-3">
                  Project Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-Gray">Service Type</p>
                    <p className="font-medium text-Gray">
                      {orderDetails.service}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-Gray">File</p>
                    <p className="font-medium text-Gray">
                      {orderDetails.filename}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-Gray">Material</p>
                    <p className="font-medium text-Gray">
                      {orderDetails.material}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-sm text-Gray">Specs</p>
                    <p className="font-medium text-Gray">
                      {orderDetails.specs}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm text-Gray">Additional Requests</p>
                    <p className="font-medium text-Gray">
                      {orderDetails.additionalRequests}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm text-Gray">Estimated Print Time</p>
                    <p className="font-medium text-Gray">
                      {orderDetails.estimatedPrintTime}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <button className="text-Pink text-sm font-medium flex items-center">
                    <span className="mr-1">Edit Details</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="border-b border-pink-100 mb-6">
                <h3 className="text-lg font-semibold text-Pink mb-4">
                  Payment Method
                </h3>

                <div className="space-y-3">
                  <div
                    className={`border rounded-lg p-4 flex items-center cursor-pointer text-Gray ${
                      paymentMethod === "bankaccount"
                        ? "border-Pink text-Pink"
                        : "border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod("bankaccount")}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border ${
                        paymentMethod === "bankaccount"
                          ? "border-Pink"
                          : "border-gray-300"
                      } flex items-center justify-center mr-3`}
                    >
                      {paymentMethod === "bankaccount" && (
                        <div className="w-3 h-3 rounded-full bg-Pink"></div>
                      )}
                    </div>
                    <div className="flex-grow">Bank Account</div>
                  </div>

                  <div
                    className={`border rounded-lg p-4 flex items-center cursor-pointer text-Gray ${
                      paymentMethod === "promptpay"
                        ? "border-Pink text-Pink"
                        : "border-gray-200"
                    }`}
                    onClick={() => setPaymentMethod("promptpay")}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border ${
                        paymentMethod === "promptpay"
                          ? "border-Pink"
                          : "border-gray-300"
                      } flex items-center justify-center mr-3`}
                    >
                      {paymentMethod === "promptpay" && (
                        <div className="w-3 h-3 rounded-full bg-Pink"></div>
                      )}
                    </div>
                    <div className="flex-grow">PromtPay</div>
                    <img
                      src="https://www.designil.com/wp-content/uploads/2020/04/prompt-pay-logo.png"
                      className="h-[30px]"
                    />
                  </div>
                  {paymentMethod === "promptpay" && (
                    <div className="flex justify-between items-center px-4 py-2 mb-4 bg-gray-100 rounded-lg">
                      <span className="text-gray-700">
                        Account Number:
                        <span> {promtpay}</span>
                      </span>
                      <button onClick={() => handleCopyToClipboard(promtpay)}>
                        <FiClipboard className="text-gray-500 hover:text-Gray active:text-Gray" />
                      </button>
                    </div>
                  )}
                  {paymentMethod === "bankaccount" && (
                    <div className="flex justify-between items-center px-4 py-2 mb-4 bg-gray-100 rounded-lg">
                      <span className="text-gray-700">
                        Account Number: SCB <span>{bankaccount}</span>
                      </span>
                      <button
                        onClick={() => handleCopyToClipboard(bankaccount)}
                      >
                        <FiClipboard className="text-gray-500 hover:text-Gray active:text-Gray" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 text-Pink border-gray-300 rounded focus:rint-Pink"
                  checked={agreeToTerms}
                  onChange={() => setAgreeToTerms(!agreeToTerms)}
                />
                <label htmlFor="terms" className="ml-2 text-sm text-Gray">
                  I agree to the{" "}
                  <span className="text-Pink cursor-pointer">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-Pink cursor-pointer">
                    Privacy Policy
                  </span>
                </label>
              </div>
            </div>

            {/* Order Summary Column */}
            <div className="col-span-1">
              <div className="bg-pink-50 rounded-lg p-6 w-full">
                <h3 className="text-lg font-semibold mb-4 text-Gray">
                  Price Summary
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <p className="text-Gray">Base Cost</p>
                    <p className="font-medium text-Gray">
                      ${orderDetails.pricing.baseCost.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-Gray">Material</p>
                    <p className="font-medium text-Gray">
                      ${orderDetails.pricing.materialCost.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-Gray">Additional Services</p>
                    <p className="font-medium text-Gray">
                      ${orderDetails.pricing.additionalServices.toFixed(2)}
                    </p>
                  </div>
                  <div className="border-t border-pink-200 pt-2 flex justify-between">
                    <p className="text-Gray">Subtotal</p>
                    <p className="font-medium text-Gray">
                      ${orderDetails.pricing.subtotal.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-Gray">Tax</p>
                    <p className="font-medium text-Gray">
                      ${orderDetails.pricing.tax.toFixed(2)}
                    </p>
                  </div>
                  <div className="border-t border-pink-200 pt-2 flex justify-between">
                    <p className="font-semibold text-lg text-Gray">Total</p>
                    <p className="font-bold text-lg text-Pink">
                      ${orderDetails.pricing.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    className={`w-full bg-Pink text-white py-3 px-6 rounded-full text-lg font-medium transition-all ${
                      agreeToTerms
                        ? "hover:bg-darkPink hover:shadow-lg active:bg-darkPink"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    disabled={!agreeToTerms}
                    onClick={handleSubmitOrder}
                  >
                    Complete Order
                  </button>
                  <p className="text-xs text-center text-Gray mt-3">
                    You won&#39;t be charged until we confirm your order
                  </p>
                </div>
              </div>
            </div>
            {copySuccess && (
              <div className="flex justify-center">
                <div className="fixed bottom-4 bg-gray-100 text-Gray px-4 py-2 rounded-md shadow-lg font-medium">
                  {copySuccess}
                </div>
              </div>
            )}
            {showModal && (
              <div className="flex justify-center">
                <div className="fixed bottom-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg font-medium">
                  Order Succesfully!
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
