"use client";
import { useState, useContext } from "react";
import { GlobalStateContext } from "@/app/context/GlobalState";
import { useRouter } from "next/navigation";

export default function ReviewAndPayPage() {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { service } = useContext(GlobalStateContext);
  const router = useRouter();

  // Sample order data that would come from previous steps
  const orderDetails = {
    service: "3D Printing",
    filename: "robot-arm-v2.stl",
    material: "PLA",
    color: "White",
    size: "15cm x 8cm x 5cm",
    additionalRequests:
      "Extra support structures for the overhanging arm joints. Medium infill (50%).",
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
    alert("Order submitted successfully! Redirecting to home page...");
    router.push("/");
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
                  <div>
                    <p className="text-sm text-Gray">Color</p>
                    <p className="font-medium text-Gray">
                      {orderDetails.color}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm text-Gray">Size</p>
                    <p className="font-medium text-Gray">{orderDetails.size}</p>
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

              <div className="border-b border-pink-100 pb-6 mb-6">
                <h3 className="text-lg font-semibold text-Pink mb-4">
                  Payment Method
                </h3>

                <div className="space-y-3">
                  <div
                    className={`border rounded-lg p-4 flex items-center cursor-pointer ${
                      paymentMethod === "credit-card"
                        ? "bordet-Pink bg-pink-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => setPaymentMethod("credit-card")}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border ${
                        paymentMethod === "credit-card"
                          ? "bordet-Pink"
                          : "border-gray-300"
                      } flex items-center justify-center mr-3`}
                    >
                      {paymentMethod === "credit-card" && (
                        <div className="w-3 h-3 rounded-full bt-Pink"></div>
                      )}
                    </div>
                    <div className="flex-grow text-Gray">Credit Card</div>
                    <div className="flex gap-2">
                      <div className="w-10 h-6 bg-blue-500 rounded"></div>
                      <div className="w-10 h-6 bg-red-500 rounded"></div>
                      <div className="w-10 h-6 bg-Gray rounded"></div>
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg p-4 flex items-center cursor-pointer ${
                      paymentMethod === "paypal"
                        ? "bordet-Pink bg-pink-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => setPaymentMethod("paypal")}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border ${
                        paymentMethod === "paypal"
                          ? "bordet-Pink"
                          : "border-gray-300"
                      } flex items-center justify-center mr-3`}
                    >
                      {paymentMethod === "paypal" && (
                        <div className="w-3 h-3 rounded-full bt-Pink"></div>
                      )}
                    </div>
                    <div className="flex-grow text-Gray">PayPal</div>
                    <div className="w-16 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                      PayPal
                    </div>
                  </div>
                </div>

                {paymentMethod === "credit-card" && (
                  <div className="mt-4 p-4 bg-pink-50 rounded-lg">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-Gray mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border border-pink-200 rounded focus:outline-none focus:bordet-Pink"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-Gray mb-1">
                            Expiration Date
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border border-pink-200 rounded focus:outline-none focus:bordet-Pink"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-Gray mb-1">
                            CVC
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border border-pink-200 rounded focus:outline-none focus:bordet-Pink"
                            placeholder="123"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-Gray mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border border-pink-200 rounded focus:outline-none focus:bordet-Pink"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                  </div>
                )}
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
                    className={`w-full bg-Pink text-white py-3 px-6 rounded-full text-lg font-semibold transition-all ${
                      agreeToTerms
                        ? "hover:bg-darkPink hover:shadow-lg transition-transform transform active:scale-90 active:bg-darkPink"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    disabled={!agreeToTerms}
                    onClick={handleSubmitOrder}
                  >
                    Complete Order
                  </button>
                  <p className="text-xs text-center text-Gray mt-3">
                    You won't be charged until we confirm your order
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
