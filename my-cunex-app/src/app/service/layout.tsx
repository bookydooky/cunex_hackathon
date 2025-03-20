'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { ArrowLeft, Share2 } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Head>
        <title>CU FASTWORK</title>
        <meta name="description" content="CU FASTWORK App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* App Header */}
      <div className="sticky top-0 left-0 right-0 px-4 py-5 flex items-center justify-between bg-white">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="transition-transform transform active:scale-90"
          >
            <ArrowLeft className="mr-4 text-pink-500 hover:text-pink-800" />
          </button>
          <div className="flex items-center">
            <div className="font-bold text-lg">
              <span className="text-pink-500">CU</span>
              <span className="text-black">NEX</span>
            </div>
            <div className="h-6 border-l border-gray-300 mx-5"></div>
            <div className="text-pink-500 text-xl font-medium">Services</div>
          </div>
        </div>
        <Share2 className="text-black" />
      </div>
    
      {/* Page Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default Layout;