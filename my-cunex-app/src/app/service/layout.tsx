'use client'
import React from 'react';
import { useRouter, usePathname} from 'next/navigation';
import Head from 'next/head';
import { ArrowLeft, Share2 } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const handlePrevious = () => {
    if (pathname === '/service/fabrication/3d/detail') {
      router.push('/service/fabrication/3d');
    }
    else if (pathname === '/service/fabrication/lasercut/detail') {
      router.push('/service/fabrication/lasercut');
    }
    else if (pathname === '/service/fabrication/3d/review') {
      router.push('/service/fabrication/3d/detail');
    }
    else if (pathname === '/service/fabrication/lasercut/review') {
      router.push('/service/fabrication/lasercut/detail');
    }
    else {
      router.push('/');
    }
  }
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Head>
        <title>CU FASTWORK</title>
        <meta name="description" content="CU FASTWORK App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* App Header */}
      <div className="px-4 py-5 flex items-center justify-between bg-white">
        <div className="flex items-center">
          <button
            onClick={handlePrevious}
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