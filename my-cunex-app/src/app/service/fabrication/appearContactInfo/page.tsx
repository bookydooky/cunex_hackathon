import React from "react";

export default function ContactPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 mx-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-Pink">Fabrication Service Provider</h1>
        <p className="text-gray-700 mt-2">Fabrication services for your needs.</p>
        
        <div className="mt-6 text-left">
          <p className="text-Gray font-semibold">📍 Address:</p>
          <p className="text-gray-600">123 Fabrication St., Industrial Area, Bangkok</p>
          
          <p className="text-Gray font-semibold mt-4">📞 Phone:</p>
          <p className="text-gray-600">+66 1234 5678</p>
          
          <p className="text-Gray font-semibold mt-4">✉️ Email:</p>
          <p className="text-gray-600">contact@fabservices.com</p>
          
          <p className="text-Gray font-semibold mt-4">🌐 Website:</p>
          <a href="https://www.fabservices.com" className="text-Pink hover:underline">www.fabservices.com</a>
        </div>
        
        <button className="mt-6 w-full bg-Pink text-white py-2 px-4 rounded-lg hover:bg-darkPink transition">
          Contact Us
        </button>
      </div>
    </div>
  );
}
