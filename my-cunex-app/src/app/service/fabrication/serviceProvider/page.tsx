"use client";
import { useRouter } from 'next/navigation';

export default function ReviewPaymentPage() {
  const router = useRouter();

  // Example project details (in a real application, these would come from previous form or context)
  const projectDetails = {
    fileName: "robot-arm-v2.stl",
    material: "PLA",
    materialIcon: "🔹",
    size: "15cm x 10cm x 8cm, Blue color, 1:5 scale",
    additionalNotes: "Please ensure smooth finish on joint surfaces. Sand down any rough edges.",
    price: 79.99,
    tax: 7.99,
    shipping: 12.00
  };

  const totalPrice = projectDetails.price + projectDetails.tax + projectDetails.shipping;

  const handleAccept = () => {
    // Process payment and redirect
    router.push("/service/fabrication/3d/confirmation");
  };

  const handleDeny = () => {
    // Go back to previous page or show cancellation message
    router.push("/service/fabrication/3d/details");
  };

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
                    <p className="text-Gray font-medium">{projectDetails.fileName}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{projectDetails.materialIcon}</div>
                  <div>
                    <p className="text-gray-600 text-sm">Material</p>
                    <p className="text-Gray font-medium">{projectDetails.material}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-600 text-sm">Size & Specifications</p>
                  <p className="text-Gray">{projectDetails.size}</p>
                </div>
                
                <div className="mb-2">
                  <p className="text-gray-600 text-sm">Additional Requests</p>
                  <p className="text-Gray">{projectDetails.additionalNotes}</p>
                </div>
              </div>

              
              <div className="border-t border-gray-200 my-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.push("/service/fabrication/3d/details")}
                  className="text-Pink font-medium hover:underline flex items-center"
                >
                </button>
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
                  <span className="text-Gray">${projectDetails.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="text-Gray">${projectDetails.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-Gray">${projectDetails.shipping.toFixed(2)}</span>
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
          <div className="bg-gray-100 rounded-lg p-6 mb-8 border border-gray-200">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-Gray mb-1">Demo Payment Information</h3>
              <p className="text-gray-600 text-sm">For demonstration purposes only</p>
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
                <span className="font-semibold text-Pink">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
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