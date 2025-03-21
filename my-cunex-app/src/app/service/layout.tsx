'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { ArrowLeft, Share2 } from 'lucide-react';
import Image from 'next/image';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  
  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-y-auto">
      <Head>
        <title>CU FASTWORK</title>
        <meta name="description" content="CU FASTWORK App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* App Header */}
      <div className="sticky top-0 left-0 right-0 px-4 py-2 flex items-center justify-between bg-white z-1">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="transition-transform transform active:scale-90"
          >
            <ArrowLeft className="mr-4 text-Pink hover:text-darkPink" />
          </button>
          <div className="flex items-center">
            <Image
              src="/assets/CUNEX-logo.png"
              alt="CUNEX Logo"
              width={48}
              height={48}
              className="h-12"
            />
            <div className="h-6 border-l border-gray-300 mx-5"></div>
            <div className="text-Pink text-xl font-medium">Services</div>
          </div>
        </div>
        <Share2 className="text-Gray" />
      </div>
    
      {/* Page Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default Layout;