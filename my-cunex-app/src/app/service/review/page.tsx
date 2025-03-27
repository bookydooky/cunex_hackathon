"use client";
import { useState, useContext } from "react";
import { GlobalStateContext } from "@/app/context/GlobalState";
import { useRouter } from "next/navigation";
import { FiClipboard } from "react-icons/fi";

export default function ReviewAndPayPage() {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [copySuccess, setCopySuccess] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { service } = useContext(GlobalStateContext);
  const router = useRouter();
  const promtpay = '092-XXX-XXX';
  const bankaccount = '038-xxxxxx-x'


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
    setShowModal(true);
    setTimeout(() => { setShowModal(false);
      router.push("/"); }
      , 2000);
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
                    <img src='https://www.designil.com/wp-content/uploads/2020/04/prompt-pay-logo.png'
                    className='h-[30px]'/>
                  </div>
                  {paymentMethod === "promptpay" && (
                  <div className="flex justify-between items-center px-4 py-2 mb-4 bg-gray-100 rounded-lg">
                    <span className="text-gray-700">Account Number: 
                      <span> {promtpay}</span>
                    </span>
                    <button onClick={() => handleCopyToClipboard(promtpay)}>
                      <FiClipboard className="text-gray-500 hover:text-Gray active:text-Gray"/>
                    </button>
                  </div>
                  )}
                  {paymentMethod === "bankaccount" && (
                    <div className="flex justify-between items-center px-4 py-2 mb-4 bg-gray-100 rounded-lg">
                      <span className="text-gray-700">
                        Account Number: SCB <span>{bankaccount}</span>
                      </span>
                      <button onClick={() => handleCopyToClipboard(bankaccount)}>
                        <FiClipboard className="text-gray-500 hover:text-Gray active:text-Gray"/>
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
